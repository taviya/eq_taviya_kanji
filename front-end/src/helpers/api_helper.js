import axios from "axios"

const axiosApi = axios.create({
	baseURL: process.env.REACT_APP_API_URL,
	headers: {
		'X-Requested-With': 'XMLHttpRequest',
		'Content-Type': 'application/json',
		'appversion' : '1.1'
		// Authorization: sessionStorage.getItem('token')
	},
	responseType: 'json',
})



export async function get(url, config = {}) {
	axiosApi.defaults.headers.Authorization = sessionStorage.getItem('token');
	return await axiosApi.get(url, { ...config }).then(response => response.data).catch(error => error)
}

export async function post(url, data, config = {}) {
	axiosApi.defaults.headers.Authorization = sessionStorage.getItem('token');
	return axiosApi
		.post(url, { ...data }, { ...config })
		.then(response => response.data)
		.catch(error => error)
}

export async function put(url, data, config = {}) {
	axiosApi.defaults.headers.Authorization = sessionStorage.getItem('token');
	return axiosApi
		.put(url, { ...data }, { ...config })
		.then(response => response.data)
		.catch(error => error)
}

export async function del(url, config = {}) {
	axiosApi.defaults.headers.Authorization = sessionStorage.getItem('token');
	return await axiosApi
		.delete(url, { ...config })
		.then(response => response.data)
		.catch(error => error)
}
