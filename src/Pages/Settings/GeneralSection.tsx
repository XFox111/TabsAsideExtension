import React from "react";
import * as Fluent from "@fluentui/react-components";
import * as Icons from "@fluentui/react-icons";
import { Alert } from "@fluentui/react-components/unstable";

import AdsPromoDialog from "../../Components/AdsPromo/AdsPromoDialog";

import SettingsRepository from "../../Services/Storage/SettingsRepository";
import SettingsModel from "../../Models/Data/SettingsModel";

export default class GeneralSection extends React.Component<{ settings: SettingsModel, settingsRepo: SettingsRepository; }>
{
	public render(): JSX.Element
	{
		return (
			<Fluent.AccordionItem value="general" className="GeneralSection">
				<Fluent.AccordionHeader icon={ <Icons.SettingsRegular /> }>
					<Fluent.Text as="h2" size={ 400 } weight="semibold">General</Fluent.Text>
				</Fluent.AccordionHeader>

				<Fluent.AccordionPanel className="stack gap">

					<Fluent.Checkbox
						label="Show dialog when deleting an item"
						onChange={ (_, e) => this.props.settingsRepo.UpdateSettingsAsync({ ShowDeleteDialog: e.checked as boolean }) }
						checked={ this.props.settings.ShowDeleteDialog } />

					<div className="stack horizontal">
						<Fluent.Checkbox
							label="Load tabs on restore"
							onChange={ (_, e) => this.props.settingsRepo.UpdateSettingsAsync({ LoadOnRestore: e.checked as boolean }) }
							checked={ this.props.settings.LoadOnRestore } />
						<Fluent.Tooltip
							relationship="description"
							content="If turned off, tabs will not load and take up memory unless you click on them">

							<Fluent.Button
								appearance="subtle"
								icon={ <Icons.InfoRegular /> } />
						</Fluent.Tooltip>
					</div>

					{/* TODO: Re-enabe the option */}
					<div className="stack horizontal" style={ { display: "none" } }>
						<Fluent.Switch
							label="Show ads in search results"
							onChange={ (_, e) => this.props.settingsRepo.UpdateSettingsAsync({ EnableSearchPromos: e.checked as boolean }) }
							checked={ this.props.settings.EnableSearchPromos } />

						<Fluent.Popover
							appearance="brand"
							positioning="after" withArrow
							defaultOpen={ false && !this.props.settings.EnableSearchPromos }>

							<Fluent.PopoverTrigger>
								<Fluent.Button
									className="adsCtaButton"
									appearance="subtle"
									icon={ <Icons.InfoRegular /> } />
							</Fluent.PopoverTrigger>

							<Fluent.PopoverSurface className="stack gap">
								<Fluent.Text size={ 500 } weight="semibold">
									🚀 Help the project grow
								</Fluent.Text>

								<Fluent.Text as="p">
									Allow us to show native ads in your search results.<br />
									This will help us to keep the project alive and growing.
								</Fluent.Text>

								<Fluent.Text as="p">
									You can always turn this off in the settings.
								</Fluent.Text>

								<div className="stack horizontal gap end">
									<Fluent.Button
										appearance="primary"
										onClick={ () => document.querySelector<HTMLButtonElement>(".GeneralSection button.adsCtaButton").click() }>

										Close
									</Fluent.Button>
									<AdsPromoDialog settings={ this.props.settings } settingsRepo={ this.props.settingsRepo } />
								</div>
							</Fluent.PopoverSurface>
						</Fluent.Popover>
					</div>

					{ this.props.settings.EnableSearchPromos &&
						<Alert icon={ <Icons.HeartFilled color={ Fluent.tokens.colorPaletteRedBorderActive } /> }>
							Thank you for supporting the project!
						</Alert>
					}

				</Fluent.AccordionPanel>
			</Fluent.AccordionItem>
		);
	}
}
