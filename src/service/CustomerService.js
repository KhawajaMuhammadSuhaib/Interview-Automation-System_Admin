import axios from 'axios'

export class CustomerService {
    getCompanies(token) {
        return axios.get('https://iastestingapi.herokuapp.com/api/admin/getCompanies', { headers: { 'x-access-token': token } })
            .then(res => res.data);
    }

    getApplicants(token) {
        return axios.get('https://iastestingapi.herokuapp.com/api/admin/getApplicants', { headers: { 'x-access-token': token } })
            .then(res => res.data);
    }
    getSubscriptions(token) {
        return axios.get('https://iastestingapi.herokuapp.com/api/admin/getSubscriptions', { headers: { 'x-access-token': token } })
            .then(res => res.data);
    }
    getCheckouts(token) {
        return axios.get('https://iastestingapi.herokuapp.com/api/admin/getCheckouts', { headers: { 'x-access-token': token } })
            .then(res => res.data);
    }
    getTotalSales(token) {
        return axios.get('https://iastestingapi.herokuapp.com/api/admin/getTotalSales', { headers: { 'x-access-token': token } })
            .then(res => res.data);
    }
    getComplains(token) {
        return axios.get('https://iastestingapi.herokuapp.com/api/admin/getComplains', { headers: { 'x-access-token': token } })
            .then(res => res.data);
    }
    getAllJobs(token) {
        return axios.get('https://iastestingapi.herokuapp.com/api/admin/getAllJobs', { headers: { 'x-access-token': token } })
            .then(res => res.data);
    }
    blockUser(token, user) {
        return axios.put('https://iastestingapi.herokuapp.com/api/admin/blockUser/' + user, {}, { headers: { 'x-access-token': token } })
            .then(res => res.data).catch(err => err);
    }
    unblockUser(token, user) {
        return axios.put('https://iastestingapi.herokuapp.com/api/admin/unBlockUser/' + user, {}, { headers: { 'x-access-token': token } })
            .then(res => res.data);
    }
    deleteJob(token, jobID) {
        return axios.delete('https://iastestingapi.herokuapp.com/api/admin/deleteJob/' + jobID, { headers: { 'x-access-token': token } })
            .then(res => res.data);
    }
    complainWorkingStatus(token, ID) {
        return axios.put('https://iastestingapi.herokuapp.com/api/admin/markedAsWorking/' + ID, {}, { headers: { 'x-access-token': token } })
            .then(res => res.data);
    }
    complainDoneStatus(token, ID) {
        return axios.put('https://iastestingapi.herokuapp.com/api/admin/markedAsDone/' + ID, {}, { headers: { 'x-access-token': token } })
            .then(res => res.data);
    }
}