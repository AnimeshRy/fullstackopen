import axios from 'axios';
const baseUrl = '/api/persons';

const getAll = async () => {
  const request = await axios.get(baseUrl);
  return request.data;
};

const create = async (newObject) => {
  const request = await axios.post(baseUrl, newObject);
  return request.then((response) => response.data);
};

const deleteRecord = async (id) => {
  await axios.delete(baseUrl + '/' + id);
};

const update = async (id, newObject) => {
  const request = await axios.put(`${baseUrl}/${id}`, newObject);
  return request.data;
};

const personService = {
  getAll,
  create,
  update,
  deleteRecord,
};
// export default { getAll, create }

export default personService;
