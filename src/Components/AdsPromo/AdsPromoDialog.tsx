import React from "react";
import * as Fluent from "@fluentui/react-components";
import * as Icons from "@fluentui/react-icons";

import SettingsRepository from "../../Services/Storage/SettingsRepository";
import SettingsModel from "../../Models/Data/SettingsModel";

import { ReactComponent as BuyMeACoffee } from "../../Assets/BuyMeACoffee.svg";

export default class AdsPromoDialog extends React.Component<{ settings: SettingsModel, settingsRepo: SettingsRepository }>
{
	public render(): JSX.Element
	{
		return (
			<Fluent.Dialog>
				<Fluent.DialogTrigger>
					<Fluent.Button>Learn more</Fluent.Button>
				</Fluent.DialogTrigger>

				<Fluent.DialogSurface>
					<Fluent.DialogBody>
						<Fluent.DialogTitle>🚀 Help the project grow!</Fluent.DialogTitle>

						<Fluent.DialogContent className="stack gap">
							<Fluent.Text as="p">
								This project is created and maintained on a non-commercial basis. And it will remain that way.
							</Fluent.Text>
							<Fluent.Text as="p">
								Although in order to keep the project growing, we need your help.
							</Fluent.Text>

							<Fluent.Text as="p">
								You can help us in two different ways:
							</Fluent.Text>

							<Fluent.Text as="p" weight="semibold">
								1. Support us with a donation. Even small amount is a big deal!
							</Fluent.Text>

							<div className="stack horizontal">
								<Fluent.Button
									as="a" target="_blank"
									href="https://buymeacoffee.com/xfox111"
									className="bmc" appearance="primary" icon={ <BuyMeACoffee /> }>

									Buy me a coffee
								</Fluent.Button>
							</div>

							<Fluent.Text as="p" weight="semibold">
								2. Allow us to show native ads in your search results.
							</Fluent.Text>

							<Fluent.Text as="p">
								This is completely free for you. All the revenue from this ads will go to the project's maintenance and development.
							</Fluent.Text>

							<Fluent.Text as="p">
								Note that this option is completely voluntary and you can always turn it off in the settings. We will not show any ads without your permission. We'll also make sure that the ads we display do not collect any of your personal information.
							</Fluent.Text>

							<Fluent.Text as="p" weight="semibold">
								Thank you :) ❤️
							</Fluent.Text>

							<Fluent.Text as="p">
								Here's an example of how ads will look like in your search results:
							</Fluent.Text>

							<Fluent.Image src="/AdsExample.png" />
						</Fluent.DialogContent>

						<Fluent.DialogActions>
							<Fluent.DialogTrigger>
								{ this.props.settings.EnableSearchPromos ?
									<Fluent.Button appearance="transparent" icon={ <Icons.CheckmarkRegular /> }>You already opted in. Thank you :)</Fluent.Button>
									:
									<Fluent.Button
										appearance="primary"
										onClick={ async () => {
											await this.props.settingsRepo.UpdateSettingsAsync({ EnableSearchPromos: true });
											document.querySelector<HTMLButtonElement>(".GeneralSection button.adsCtaButton")?.click();
										} }>

										Enable ads integration
									</Fluent.Button>
								}
							</Fluent.DialogTrigger>
							<Fluent.DialogTrigger>
								<Fluent.Button>Close</Fluent.Button>
							</Fluent.DialogTrigger>
						</Fluent.DialogActions>
					</Fluent.DialogBody>
				</Fluent.DialogSurface>
			</Fluent.Dialog>
		);
	}
}
