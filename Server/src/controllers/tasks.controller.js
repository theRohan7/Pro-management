import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Task } from "../models/tasks.model.js";
import { User } from "../models/user.model.js";
import moment from "moment";


const createTask = asyncHandler(async (req, res) => {
  const { title, priority, status, dueDate, asigneeId, checklists } = req.body;
  const userId = req.user._id;

  if (!title || title === '') {
    throw new ApiError(400, 'Title is required');
  }

  if (!priority || priority === '') {
    throw new ApiError(400, 'Priority is required');
  }
  if (!status || status === '') {
    throw new ApiError(400, 'Status is required');
  }
  if (checklists.length < 1) {
    throw new ApiError(400, 'Atleast 1 checklist is required');
  }

  const user = await User.findById(userId);

  if (!user) {
    throw new ApiError(404, 'User not found');
  }

  const task = await Task.create({
    title,
    owner: userId,
    priority,
    status,
    dueDate,
    asignee: asigneeId || null,
    checklists,
  });

  const createdTask = await Task.findById(task._id).populate('asignee');

  if (asigneeId !== null) {
    await User.findByIdAndUpdate(
      asigneeId,
      { $addToSet: { tasks: task._id } },
      { new: true, validateBeforeSave: false }
    );
    await updateUserAnalytics(asigneeId, null, priority, null, status, dueDate, 1)
  }

  await User.findByIdAndUpdate(
    userId,
    { $addToSet: { tasks: task._id } },
    { new: true, validateBeforeSave: false }
  );

  await updateUserAnalytics(userId, null, priority, null, status, dueDate, 1);

  return res
    .status(201)
    .json(new ApiResponse(201, createdTask, 'Task created successfully'));
});

const changeTaskStatus = asyncHandler(async (req, res) => {
  const { status, taskId } = req.body;
  const userId = req.user._id;

  const user = await User.findById(userId);
  if (!user) {
    throw new ApiError(404, 'User not found');
  }

  const task = await Task.findById(taskId).populate(['asignee', 'owner']);
  if (!task) {
    throw new ApiError(404, 'Task not found');
  }

  const isOwner = task.owner._id.toString() === userId.toString();
  const isAsignee = task.asignee && task.asignee._id.toString() === userId.toString();

  if (!isOwner && !isAsignee) {
    throw new ApiError(403, "You are not authorized to update this task");
  }

  if (!['Backlog', 'Todo', 'In Progress', 'Done'].includes(status)) {
    throw new ApiError(400, 'Invalid status');
  }

  const oldStatus = task.status;
  task.status = status;
  await task.save({ validateBeforeSave: false });

  if(task.owner) {
    await updateUserAnalytics(task.owner._id, null, null, oldStatus, status, null, 1);
  }

  if (task.asignee && task.asignee._id.toString() !== task.owner._id.toString()) {
    await updateUserAnalytics(task.asignee._id, null, null, oldStatus, status, null, 1);
  }

  return res
    .status(200)
    .json(new ApiResponse(200, task, 'Task status updated successfully'));
});

const editTask = asyncHandler(async (req, res) => {
  const { title, priority, dueDate, asigneeId, checklists } = req.body;
  const { taskId } = req.params;
  const userId = req.user._id;

  const user = await User.findById(userId);
  if (!user) {
    throw new ApiError(404, 'User not found');
  }

  const task = await Task.findById(taskId).populate('asignee');
  if (!task) {
    throw new ApiError(404, 'Task not found');
  }

  if(task.owner.toString() !== userId.toString()) {
    throw new ApiError(403, 'You are not authorized to edit this task');
  }

  const newAsignee = await User.findById(asigneeId).select('-password');
  if (!newAsignee) {
    throw new ApiError(404, 'Assigned user not found');
  }

  const oldAsignee = task.asignee;
  const oldPriority = task.priority;
  const oldDueDate = task.dueDate;


  task.title = title;
  task.priority = priority;
  task.dueDate = dueDate;
  task.asignee = newAsignee;
  task.checklists = checklists;
  await task.save({ validateBeforeSave: false });

  if (!newAsignee.tasks.includes(task._id)) {
    newAsignee.tasks.push(task._id);
    await newAsignee.save({ validateBeforeSave: false });
  }

  if (oldAsignee && oldAsignee._id.toString() !== newAsignee._id.toString()) {
    await User.findByIdAndUpdate(
      oldAsignee._id,
      { $pull: { tasks: task._id } },
      { new: true, validateBeforeSave: false }
    );
    await updateUserAnalytics(oldAsignee._id, oldPriority, null, null, null, oldDueDate, -1);
  }

  await updateUserAnalytics(userId, oldPriority, priority, null, null, dueDate, 1);
  await updateUserAnalytics(newAsignee._id, null, priority, null, null, dueDate, 1)

  return res
    .status(200)
    .json(new ApiResponse(200, task, 'Task updated successfully'));
});

 const deleteTask = asyncHandler(async (req, res) => {
  const { taskId } = req.params;
  const userId = req.user._id;

  const user = await User.findById(userId);
  if (!user) {
    throw new ApiError(404, 'User not found');
  }

  const task = await Task.findById(taskId).populate('asignee');
  if (!task) {
    throw new ApiError(404, 'Task not found');
  }

  if (task.owner.toString() !== userId.toString()) {
    throw new ApiError(403, "You are not authorized to delete this task");
  }

  const asignee = task.asignee;

  await Task.findByIdAndDelete(taskId);

  await User.findByIdAndUpdate(
    userId,
    { $pull: { tasks: taskId } },
    { new: true, validateBeforeSave: false }
  );

  if (asignee) {
    await User.findByIdAndUpdate(
      asignee._id,
      { $pull: { tasks: taskId } },
      { new: true, validateBeforeSave: false }
    );
  }

  await updateUserAnalytics(userId,null, task.priority, null,task.status, task.dueDate, -1);

  if (asignee) {
    await updateUserAnalytics(asignee._id,null, task.priority, null,task.status, task.dueDate, -1);
  }

  return res
    .status(200)
    .json(new ApiResponse(200, null, 'Task deleted successfully'));
});


 const filterTasks = asyncHandler(async (req, res) => {
    const  {filter = 'This Week'} = req.query;
    const id = req.user._id



    let  startDate;
    let  endDate 
    switch (filter) {
        case 'Today':
            startDate = moment().startOf('day');
            endDate = moment().endOf('day');
            break;
        case 'This Week':
            startDate = moment().startOf('week');
            endDate = moment().endOf('week');
            break;
        case 'This Month':
            startDate = moment().startOf('month');
            endDate = moment().endOf('month');
            break;
    }

    const tasks = await Task.find({
        $or: [
            { owner: id },     
            { asignee: id }   
        ],
        createdAt: {
            $gte: startDate.toDate(),
            $lte: endDate.toDate()
        }
    }).populate([
        {
            path: 'asignee',
            select: 'name email _id'
        },
        {
            path: 'owner',
            select: 'name email'
        }
    ]);

    if (!tasks || tasks.length === 0) {
        return res
        .status(200)
        .json(new ApiResponse(
            200, 
            [],
            "No tasks found for the selected period"
        ));
    }



    res
    .status(200)
    .json( new ApiResponse(200, tasks, "Tasks fetched successfully"))

 })

 const getSharedTask = asyncHandler(async (req, res) => {
    const {taskId} = req.params

    const task = await Task.findById(taskId)

    if(!task){
        throw new ApiError(404, "Task not found")
    }

    return res
    .status(200)
    .json( new ApiResponse(200, task, "Task fetched successfully"))
 })

 const taskChecklistCompletion = asyncHandler(async (req, res) => {

    const { taskId, checklistIndex } = req.body;

    const task = await Task.findById(taskId).populate('asignee');

    if (!task) {
        throw new ApiError(404, "Task not found");
    }

    if(task.checklists[checklistIndex]){
        task.checklists[checklistIndex].completed = !task.checklists[checklistIndex].completed
    } else {
        throw new ApiError(404, "Checklist item not found");
    }

    await task.save({ validateBeforeSave: false });

    return res
    .status(200)
    .json( new ApiResponse(200, task, "Task checklist updated successfully"))
 })


 const updateUserAnalytics = async (
                                  userId, 
                                  oldPriority = null, 
                                  newPriority = null,
                                  oldStatus = null, 
                                  newStatus = null,
                                  dueDate = null,
                                  increment = 1
                                  ) => {
  const analyticsUpdate = {};

  // Update priority-related analytics
  if (oldPriority !== newPriority) {
    switch (oldPriority) {
      case 'Low Priority':
        analyticsUpdate['analytics.lowPriorityTasks'] = increment * -1;
        break;
      case 'Moderate Priority':
        analyticsUpdate['analytics.moderatePriorityTasks'] = increment * -1;
        break;
      case 'High Priority':
        analyticsUpdate['analytics.highPriorityTasks'] = increment * -1;
        break;
    }

    switch (newPriority) {
      case 'Low Priority':
        analyticsUpdate['analytics.lowPriorityTasks'] = (analyticsUpdate['analytics.lowPriorityTasks'] || 0) + increment;
        break;
      case 'Moderate Priority':
        analyticsUpdate['analytics.moderatePriorityTasks'] = (analyticsUpdate['analytics.moderatePriorityTasks'] || 0) + increment;
        break;
      case 'High Priority':
        analyticsUpdate['analytics.highPriorityTasks'] = (analyticsUpdate['analytics.highPriorityTasks'] || 0) + increment;
        break;
    }
  }

  // Update status-related analytics
  if (oldStatus !== newStatus) {
    switch (oldStatus) {
      case 'Backlog':
        analyticsUpdate['analytics.backlogTasks'] = increment * -1;
        break;
      case 'Todo':
        analyticsUpdate['analytics.todoTasks'] = increment * -1;
        break;
      case 'In Progress':
        analyticsUpdate['analytics.inProgressTasks'] = increment * -1;
        break;
      case 'Done':
        analyticsUpdate['analytics.doneTasks'] = increment * -1;
        break;
    }

    switch (newStatus) {
      case 'Backlog':
        analyticsUpdate['analytics.backlogTasks'] = (analyticsUpdate['analytics.backlogTasks'] || 0) + increment;
        break;
      case 'Todo':
        analyticsUpdate['analytics.todoTasks'] = (analyticsUpdate['analytics.todoTasks'] || 0) + increment;
        break;
      case 'In Progress':
        analyticsUpdate['analytics.inProgressTasks'] = (analyticsUpdate['analytics.inProgressTasks'] || 0) + increment;
        break;
      case 'Done':
        analyticsUpdate['analytics.doneTasks'] = (analyticsUpdate['analytics.doneTasks'] || 0) + increment;
        break;
    }
  }

  // Update due date-related analytics
  if (dueDate && !isNaN(new Date(dueDate).getTime())) {
    analyticsUpdate['analytics.dueDateTasks'] = (analyticsUpdate['analytics.dueDateTasks'] || 0) + increment;
}

  await User.findByIdAndUpdate(userId, {
    $inc: analyticsUpdate,
  },{new: true, validateBeforeSave: false});
};


export {
    createTask,
    changeTaskStatus,
    editTask,
    deleteTask,
    filterTasks,
    getSharedTask,
    taskChecklistCompletion
}