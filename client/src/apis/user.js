import {api} from "./clients";
import auth from "./auth-helper";

//GET ALL USERS
export const getUsers =async () => {
    return await api.get("./api/users/");
};

//GET SINGLE USER
export const getUser = async(id) => {
    return await api.get(`./api/users/${id}`);
};

//CREATE A USER
export const createUser = async(user) => {
    return await api.post('/api/users/',user);
};

//UPDATE USER
export const UPDATEUser = async(id,updates) => {
    return await api.put(`./api/users/${id}`,updates);
};

// DELETE USER
export const deleteUser = async(id) => {
    return await api.delete(`./api/users/${id}`);
};

