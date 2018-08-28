/**
 * External dependencies
 */
import { combineReducers } from 'redux';
import assign from 'lodash/assign';

/**
 * Internal dependencies
 */
import {
	JETPACK_SITE_VERIFY_GOOGLE_STATUS_FETCH,
	JETPACK_SITE_VERIFY_GOOGLE_STATUS_FETCH_FAIL,
	JETPACK_SITE_VERIFY_GOOGLE_STATUS_FETCH_SUCCESS,
} from 'state/action-types';

export const google = ( state = { fetching: false, verified: false }, action ) => {
	switch ( action.type ) {
		case JETPACK_SITE_VERIFY_GOOGLE_STATUS_FETCH:
			return assign( {}, state, {
				fetching: true
			} );
		case JETPACK_SITE_VERIFY_GOOGLE_STATUS_FETCH_FAIL:
			return assign( {}, state, {
				fetching: false,
				error: action.error
			} );
		case JETPACK_SITE_VERIFY_GOOGLE_STATUS_FETCH_SUCCESS:
			return assign( {}, state, {
				fetching: false,
				verified: action.verified,
				token: action.token
			} );

		// case JETPACK_SETTING_UPDATE:
		// case JETPACK_SETTINGS_UPDATE:
		// 	return merge( {}, state, {
		// 		settingsSent: mapValues( action.updatedOptions, () => true )
		// 	} );
		// case JETPACK_SETTING_UPDATE_FAIL:
		// case JETPACK_SETTING_UPDATE_SUCCESS:
		// case JETPACK_SETTINGS_UPDATE_FAIL:
		// case JETPACK_SETTINGS_UPDATE_SUCCESS:
		// 	return merge( {}, state, {
		// 		settingsSent: mapValues( action.updatedOptions, () => false )
		// 	} );
		default:
			return state;
	}
};

export const reducer = combineReducers( {
	google
} );

/**
 * Returns true if currently requesting settings lists or false
 * otherwise.
 *
 * @param  {Object}  state Global state tree
 * @return {Boolean}       Whether settings are being requested
 */
export function isFetchingGoogleSiteVerify( state ) {
	return !! state.jetpack.siteVerify.google.fetching;
}
