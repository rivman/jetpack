/**
 * Internal dependencies
 */
import restApi from 'rest-api';

export const verifySiteGoogle = () => {
	return () => {
		return restApi.verifySiteGoogle();
	};
};

export const checkVerifySiteGoogle = () => {
	return () => {
		return restApi.checkVerifySiteGoogle();
	};
};
