/**
 * Internal dependencies
 */
import restApi from 'rest-api';
import { translate as __ } from 'i18n-calypso';
import { createNotice, removeNotice } from 'components/global-notices/state/notices/actions';

export const verifySiteGoogle = () => {
	return ( dispatch ) => {
		dispatch( createNotice(
			'is-info',
			__( 'Verifying with Google' ),
			{ id: 'verify-site-google-begin' }
		) );
		return restApi.verifySiteGoogle().then( ( data ) => {
			// console.warn( data );
			dispatch( createNotice( 'is-success', __( 'Site Verified' ), { id: 'verify-site-google-done', duration: 2000 } ) );
			return data;
		} ).catch( ( error ) => {
			// console.error( error );
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
