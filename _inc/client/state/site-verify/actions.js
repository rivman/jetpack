/**
 * Internal dependencies
 */
import {
	JETPACK_SITE_VERIFY_GOOGLE_STATUS_FETCH,
	JETPACK_SITE_VERIFY_GOOGLE_STATUS_FETCH_FAIL,
	JETPACK_SITE_VERIFY_GOOGLE_STATUS_FETCH_SUCCESS,
} from 'state/action-types';

import restApi from 'rest-api';
import { translate as __ } from 'i18n-calypso';
import { createNotice, removeNotice } from 'components/global-notices/state/notices/actions';

export const verifySiteGoogle = () => {
	return ( dispatch ) => {
		dispatch( {
			type: JETPACK_SITE_VERIFY_GOOGLE_STATUS_FETCH
		} );
		dispatch( createNotice(
			'is-info',
			__( 'Verifying with Google' ),
			{ id: 'verify-site-google-begin' }
		) );
		return restApi.verifySiteGoogle().then( ( data ) => {
			// console.warn( data );
			dispatch( {
				type: JETPACK_SITE_VERIFY_GOOGLE_STATUS_FETCH_SUCCESS,
				verified: data.verified,
				token: data.token
			} );
			dispatch( createNotice( 'is-success', __( 'Site Verified' ), { id: 'verify-site-google-done', duration: 2000 } ) );
			return data;
		} ).catch( ( error ) => {
			// console.error( error );
			dispatch( {
				type: JETPACK_SITE_VERIFY_GOOGLE_STATUS_FETCH_FAIL,
				error
			} );
			dispatch( createNotice(
				'is-error',
				__( 'Failed to verify site with Google: %(error)s', {
					args: { error }
				} ),
				{ id: 'verify-site-google-error' }
			) );
			throw error;
		} ).finally( () => {
			dispatch( removeNotice( 'verify-site-google-begin' ) );
		} );
	};
};
