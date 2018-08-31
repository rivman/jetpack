/**
 * External dependencies
 */
import React from 'react';
import { translate as __ } from 'i18n-calypso';
import TextInput from 'components/text-input';
import ExternalLink from 'components/external-link';
import { connect } from 'react-redux';

/**
 * Internal dependencies
 */
import {
	isFetchingSiteData,
} from 'state/site';
import {
	FormFieldset,
	FormLabel
} from 'components/forms';
import { ModuleSettingsForm as moduleSettingsForm } from 'components/module-settings/module-settings-form';
import SettingsCard from 'components/settings-card';
import SettingsGroup from 'components/settings-group';
import JetpackBanner from 'components/jetpack-banner';
import Gridicon from 'components/gridicon';
import Button from 'components/button';
import { getSiteID } from 'state/site/reducer';
// eslint-disable-next-line no-unused-vars
import requestExternalAccess from 'lib/sharing';
import { getExternalServiceConnectUrl } from 'state/publicize/reducer';
import {
	checkVerifyStatusGoogle,
	verifySiteGoogle,
	isFetchingGoogleSiteVerify,
	isConnectedToGoogleSiteVerificationAPI,
	isSiteVerified,
	isVerifyingGoogleSite
} from 'state/site-verify';

class VerificationServicesComponent extends React.Component {
	activateVerificationTools = () => {
		return this.props.updateOptions( { 'verification-tools': true } );
	};

	componentWillMount() {
		this.checkVerifySite();
	}

	checkVerifySite() {
		this.props.checkVerifyStatusGoogle().then( ( { verified, token } ) => {
			if ( verified ) {
				return;
			}
			if ( token ) {
				this.props.updateOptions( { google: token } ).then( () => {
					this.props.refreshSettings();
					this.props.checkVerifyStatusGoogle();
				} );
			}
		} ).catch( () => {
			// ignore error
		} );
	}

	handleClickGoogleVerify = () => {
		if ( this.props.fetchingSiteData || this.props.fetchingGoogleSiteVerify ) {
			return;
		}

		if ( ! this.props.isConnectedToGoogle ) {
			requestExternalAccess( this.props.googleSiteVerificationConnectUrl, () => {
				this.props.verifySiteGoogle();
			} );
			return;
		}

		if ( ! this.props.isSiteVerified ) {
			this.props.verifySiteGoogle();
		} else {
			this.checkVerifySite();
		}
	};

	renderVerifyButton( id ) {
		if ( 'google' !== id ) {
			return null;
		}

		const disabled = this.props.fetchingSiteData || this.props.fetchingGoogleSiteVerify || this.props.isSiteVerified;

		if ( this.props.isVerifyingGoogleSite ) {
			return (
				<span className="jp-form-input-suffix">
					{ __( 'Verifying...' ) }
				</span>
			);
		} else if ( ! this.props.isConnectedToGoogle ) {
			return (
				<Button className="jp-form-input-suffix" type="button" disabled={ disabled } onClick={ this.handleClickGoogleVerify }>
					{ __( 'Connect with Google' ) }
				</Button>
			);
		} else if ( this.props.isSiteVerified ) {
			return (
				<span className="jp-form-input-suffix jp-form-suffix-site-verification-verified">
					<Gridicon icon="checkmark-circle" size={ 20 } />
					{ ' ' }
					{ __( 'Your site is verified with Google' ) }
				</span>
			);
		}

		return (
			<Button className="jp-form-input-suffix" type="button" disabled={ disabled } onClick={ this.handleClickGoogleVerify }>
				{ __( 'Click to Verify' ) }
			</Button>
		);
	}

	render() {
		const verification = this.props.getModule( 'verification-tools' );

		if ( 'inactive' === this.props.getModuleOverride( 'google-analytics' ) ) {
			return (
				<JetpackBanner
					title={ verification.name }
					icon="cog"
					description={ __( '%(moduleName)s has been disabled by a site administrator.', {
						args: {
							moduleName: verification.name
						}
					} ) }
				/>
			);
		}

		// Show one-way activation banner if not active
		if ( ! this.props.getOptionValue( 'verification-tools' ) ) {
			return (
				<JetpackBanner
					callToAction={ __( 'Activate' ) }
					title={ verification.name }
					icon="cog"
					description={ verification.long_description }
					onClick={ this.activateVerificationTools }
				/>
			);
		}

		return (
			<SettingsCard
				{ ...this.props }
				module="verification-tools"
				saveDisabled={ this.props.isSavingAnyOption( [ 'google', 'bing', 'pinterest', 'yandex' ] ) }
			>
				<SettingsGroup
					module={ verification }
					support={ {
						text: __( 'Provides the necessary hidden tags needed to verify your WordPress site with various services.' ),
						link: 'https://jetpack.com/support/site-verification-tools',
					} }
					>
					<p>
						{ __(
							'Note that {{b}}verifying your site with these services is not necessary{{/b}} in order for your site to be indexed by search engines. To use these advanced search engine tools and verify your site with a service, paste the HTML Tag code below. Read the {{support}}full instructions{{/support}} if you are having trouble. Supported verification services: {{google}}Google Search Console{{/google}}, {{bing}}Bing Webmaster Center{{/bing}}, {{pinterest}}Pinterest Site Verification{{/pinterest}}, and {{yandex}}Yandex.Webmaster{{/yandex}}.',
							{
								components: {
									b: <strong />,
									support: <a href="https://jetpack.com/support/site-verification-tools/" />,
									google: (
										<ExternalLink
											icon={ true }
											target="_blank" rel="noopener noreferrer"
											href="https://www.google.com/webmasters/tools/"
										/>
									),
									bing: (
										<ExternalLink
											icon={ true }
											target="_blank" rel="noopener noreferrer"
											href="https://www.bing.com/webmaster/"
										/>
									),
									pinterest: (
										<ExternalLink
											icon={ true }
											target="_blank" rel="noopener noreferrer"
											href="https://pinterest.com/website/verify/"
										/>
									),
									yandex: (
										<ExternalLink
											icon={ true }
											target="_blank" rel="noopener noreferrer"
											href="https://webmaster.yandex.com/sites/"
										/>
									)
								}
							}
						) }
					</p>
					<FormFieldset>
						{
							[
								{
									id: 'google',
									label: __( 'Google' ),
									placeholder: '<meta name="google-site-verification" content="1234" />'
								},
								{
									id: 'bing',
									label: __( 'Bing' ),
									placeholder: '<meta name="msvalidate.01" content="1234" />'
								},
								{
									id: 'pinterest',
									label: __( 'Pinterest' ),
									placeholder: '<meta name="p:domain_verify" content="1234" />'
								},
								{
									id: 'yandex',
									label: __( 'Yandex' ),
									placeholder: '<meta name="yandex-verification" content="1234" />'
								}
							].map( item => (
								<FormLabel
									className="jp-form-input-with-prefix"
									key={ `verification_service_${ item.id }` }>
									<span>{ item.label }</span>
									<TextInput
										name={ item.id }
										value={ this.props.getOptionValue( item.id ) }
										placeholder={ item.placeholder }
										className="code"
										disabled={ this.props.isUpdating( item.id ) }
										onChange={ this.props.onOptionChange } />
									{ this.renderVerifyButton( item.id ) }
								</FormLabel>
							) )
						}
					</FormFieldset>
				</SettingsGroup>
			</SettingsCard>
		);
	}
}

export const VerificationServices = connect(
	state => {
		return {
			fetchingSiteData: isFetchingSiteData( state ),
			siteID: getSiteID( state ),
			googleSiteVerificationConnectUrl: getExternalServiceConnectUrl( state, 'google_site_verification' ),
			fetchingGoogleSiteVerify: isFetchingGoogleSiteVerify( state ),
			isConnectedToGoogle: isConnectedToGoogleSiteVerificationAPI( state ),
			isSiteVerified: isSiteVerified( state ),
			isVerifyingGoogleSite: isVerifyingGoogleSite( state ),
		};
	},
	{
		checkVerifyStatusGoogle,
		verifySiteGoogle,
	}
)( moduleSettingsForm( VerificationServicesComponent ) );
