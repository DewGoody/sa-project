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

    // cunex() {
    //   try {
    //     axios.get('http://localhost:1337/api/cunex' );
    //   } catch (error) {
    //     console.error('Error creating form:', error);
    //     throw error; // Rethrow the error to be handled by the caller
    //   }
    // }
  
    // Add other service methods here
  }
  
  export default PrakanService;
  //edit