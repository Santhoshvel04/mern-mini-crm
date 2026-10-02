import axiosInstance from './index';

export async function fetchTasks() {
  const { data } = await axiosInstance.get('/tasks');
  return data.data;
}

export async function createTask(payload) {
  const { data } = await axiosInstance.post('/tasks', payload);
  return data.data;
}

export async function updateTaskStatus(id, status) {
  const { data } = await axiosInstance.patch(`/tasks/${id}/status`, { status });
  return data.data;
}
