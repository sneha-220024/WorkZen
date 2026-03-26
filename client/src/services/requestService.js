import api from './api';

export const getEmployeeRequests = async () => {
    const response = await api.get('/employee/requests');
    return response.data;
};

export const createRequest = async (requestData) => {
    const response = await api.post('/employee/requests', requestData);
    return response.data;
};

export const getAllRequestsHR = async () => {
    const response = await api.get('/hr/requests');
    return response.data;
};

export const updateRequestStatusHR = async (id, status) => {
    const response = await api.patch(`/hr/requests/${id}/status`, { status });
    return response.data;
};
