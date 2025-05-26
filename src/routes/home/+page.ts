import { browser } from '$app/environment';
import { redirect } from '@sveltejs/kit';

export const load = async () => {
	if (browser) {
		const userId = localStorage.getItem('userId');
		if (!userId) {
			throw redirect(303, '/');
		}
	}
	return {};
};
