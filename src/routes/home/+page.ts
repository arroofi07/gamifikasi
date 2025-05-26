import { browser } from '$app/environment';
import { redirect } from '@sveltejs/kit';

export const load = async () => {
	if (browser) {
		// Check if userData exists in localStorage
		const userDataStr = localStorage.getItem('userData');
		if (!userDataStr) {
			throw redirect(303, '/');
		}

		try {
			// Parse the userData and check expiration
			const userData = JSON.parse(userDataStr);
			const now = new Date().getTime();

			// Check if userData has expiry property and if it's expired
			if (!userData.expiry || now > userData.expiry) {
				localStorage.removeItem('userData');
				throw redirect(303, '/');
			}
		} catch (error) {
			// If JSON parsing fails or any other error occurs
			localStorage.removeItem('userData');
			throw redirect(303, '/');
		}
	}
	return {};
};
