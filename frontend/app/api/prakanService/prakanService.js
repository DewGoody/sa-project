import axios from 'axios';

class PrakanService {
  async createPrakanForm(data) {
    try {
      const response = await axios.post('http://localhost:1337/api/create', data);
      return response.data; // Return response data if needed
    } catch (error) {
      console.error('Error creating form:', error);
      throw error; // Rethrow the error to be handled by the caller
    }
  }


  async cunex(data) {
    try {
      let response = await axios.get('http://localhost:1337/api/cunex', { params: data })
      return response.data.data
    } catch (error) {
      console.error('Error creating form:', error);
      throw error; // Rethrow the error to be handled by the caller
    }
  }

  // Add other service methods here
}

export default PrakanService;
