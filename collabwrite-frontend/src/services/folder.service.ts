import api from './api';

export interface FolderData {
    name: string;
}

export const folderService = {
    async getFolders() {
        const response = await api.get('/folder/all');
        return response.data;
    },

    async createFolder(data: FolderData) {
        const response = await api.post('/folder/add', data);
        return response.data;
    },

    async deleteFolder(data: FolderData) {
        const response = await api.delete(`/folder/delete?name=${data.name}`);
        return response.data;
    }
}