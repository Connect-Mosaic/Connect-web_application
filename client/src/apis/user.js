    import {api} from "./client";
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

    // UPLOAD PROFILE PHOTO
    export const uploadProfilePhoto = async (userId, file) => {
    const formData = new FormData();
    formData.append("profilePhoto", file);

    const response = await api.post(
        `/api/users/${userId}/upload-photo`,
        formData,
        {
        headers: { "Content-Type": "multipart/form-data" }
        }
    );

    return response.data;
    };

    export const uploadGalleryPhoto = async (userId, file) => {
    const formData = new FormData();
    formData.append("galleryPhoto", file);

    const response = await api.post(
        `/api/users/${userId}/upload-gallery`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
    );

    return response.data;
    };
