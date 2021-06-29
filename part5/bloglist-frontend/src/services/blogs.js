import axios from 'axios';
const baseUrl = '/api/blogs';

let token = null;
let config;

const setToken = (newToken) => {
  token = `bearer ${newToken}`;
  // adding to header
  config = {
    headers: { Authorization: token },
  };
};

const getAll = () => {
  const request = axios.get(baseUrl);
  return request.then((response) => response.data);
};

const create = async (newObject) => {
  const response = await axios.post(baseUrl, newObject, config);
  return response.data;
};

const update = async (objectToUpdate) => {
  const response = await axios.put(
    `${baseUrl}/${objectToUpdate.id}`,
    objectToUpdate,
    config
  );
  return response.data;
};

const remove = async (id) => {
  const response = await axios.delete(`${baseUrl}/${id}`, config);
  return response.data;
};

const blogService = {
  setToken,
  getAll,
  create,
  update,
  remove,
};

export default blogService;
