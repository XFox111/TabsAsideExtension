import React from "react";
import * as Fluent from "@fluentui/react-components";
import * as Icons from "@fluentui/react-icons";
import { isEdgeChromium, isFirefox } from "react-device-detect";
import { CreateTab } from "../../Utils/ExtensionUtils";

import ContributorsList from "../../Utils/ContributorsList";
import { ReactComponent as BuyMeACoffee } from "../../Assets/BuyMeACoffee.svg";

export default class AboutSection extends React.Component
{
	public render(): JSX.Element
	{
		return (
			<Fluent.AccordionItem value="about" className="AboutSection">
				<Fluent.AccordionHeader icon={ <Icons.InfoRegular /> }>
					<Fluent.Text as="h2" size={ 400 } weight="semibold">About</Fluent.Text>
				</Fluent.AccordionHeader>

				<Fluent.AccordionPanel className="stack gap">
					<Fluent.Text as="p">
						Developed by Eugene Fox (<Fluent.Link href="https://twitter.com/xfox111" target="_blank">@xfox111</Fluent.Link>)<br />
						Licensed under <Fluent.Link href="https://github.com/XFox111/TabsAsideExtension/blob/master/LICENSE" target="_blank">MIT License</Fluent.Link>
					</Fluent.Text>

					<Fluent.Text as="p">
						Want to contribute translation for your language? <Fluent.Link href="https://github.com/XFox111/TabsAsideExtension/blob/master/CONTRIBUTING.md" target="_blank">Read this to get started</Fluent.Link>
					</Fluent.Text>

					<Fluent.Text as="p">
						<Fluent.Text weight="semibold">Contributors</Fluent.Text><br />
						{ ContributorsList.map((c, i) =>
							<Fluent.Text key={ i }>
								<Fluent.Link href={ "https://github.com/" + c.username }>@{ c.username }</Fluent.Link> - { c.reason }<br />
							</Fluent.Text>
						) }
					</Fluent.Text>

					<div className="stack horizontal gap">
						<Fluent.Button
							appearance="primary" icon={ <Icons.PersonFeedbackRegular /> }
							onClick={ () => this.OpenFeedback() }>

							Leave feedback
						</Fluent.Button>

						<Fluent.Button
							as="a" target="_blank"
							href="https://buymeacoffee.com/xfox111"
							className="bmc" appearance="primary" icon={ <BuyMeACoffee /> }>

							Buy me a coffee
						</Fluent.Button>
					</div>

					<Fluent.Text as="p">
						<Fluent.Link href="https://xfox111.net/" target="_blank">My website</Fluent.Link><br />
						<Fluent.Link href="https://github.com/xfox111/TabsAsideExtension" target="_blank">Source code</Fluent.Link><br />
						<Fluent.Link href="https://github.com/xfox111/TabsAsideExtension/releases/latest" target="_blank">Changelog</Fluent.Link>
					</Fluent.Text>
				</Fluent.AccordionPanel>
			</Fluent.AccordionItem>
		);
	}

	private async OpenFeedback() : Promise<void>
	{
		let url : string;

		if (isFirefox)
			url = "https://addons.mozilla.org/en-US/firefox/addon/ms-edge-tabs-aside/";
		else if (isEdgeChromium)
			url = "https://microsoftedge.microsoft.com/addons/detail/tabs-aside/kmnblllmalkiapkfknnlpobmjjdnlhnd";
		else
			url = "https://chrome.google.com/webstore/detail/mgmjbodjgijnebfgohlnjkegdpbdjgin";

		await CreateTab({ url });
	}
}
