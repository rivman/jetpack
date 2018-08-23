/**
 * Internal dependencies
 */
import restApi from 'rest-api';

export const verifySiteGoogle = () => {
	return () => {
		return restApi.verifySiteGoogle();
	};
};
