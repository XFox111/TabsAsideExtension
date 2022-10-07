import { Text, Link, Accordion, AccordionItem, AccordionHeader, AccordionPanel, Switch, Label, Button, Title2, Checkbox, CompoundButton, RadioGroup, Radio } from "@fluentui/react-components";
import { Dropdown, Option } from "@fluentui/react-components/unstable";
import { SettingsRegular, CheckmarkCircleRegular, CloudRegular, ArrowDownloadRegular, ArrowUploadRegular, InfoRegular, PersonFeedbackRegular, ChevronLeftRegular, KeyCommandRegular, WindowNewRegular, CalendarAddRegular, TabInPrivateRegular, WindowArrowUp24Regular, AppsRegular, WindowRegular, CursorClickRegular } from "@fluentui/react-icons";
import React from "react";
import ProgressBar from "../Components/ProgressBar";
import { ReactComponent as BuyMeACoffee } from "../Assets/BuyMeACoffee.svg";
import "./SettingsView.scss";

interface IStates
{
	storageQuota: number;
	storageUsed: number;
}

export default class SettingsView extends React.Component<any, IStates>
{
	constructor(props: any)
	{
		super(props);

		this.state =
		{
			storageUsed: NaN,
			storageQuota: NaN
		};
	}

	public async componentDidMount(): Promise<void>
	{
		let storageUsed: number = parseFloat((await chrome?.storage?.sync?.getBytesInUse() / 1024).toFixed(1));
		let storageQuota: number = chrome?.storage?.sync?.QUOTA_BYTES / 1024;

		this.setState({ storageUsed, storageQuota });
	}

	public render(): JSX.Element
	{
		return (
			<main className="SettingsView stack">
				<header>
					<Title2 as="h1">Settings | Tabs aside</Title2>
				</header>
				<article>
					<Accordion defaultOpenItems="about">
						<AccordionItem value="general">
							<AccordionHeader icon={ <SettingsRegular /> }>
								<Text as="h2" size={ 400 } weight="semibold">General</Text>
							</AccordionHeader>
							<AccordionPanel className="stack gap horizontal wrap space-between">
								<div className="stack gap">
									<div className="stack">
										<Checkbox label="Add extension to browser context menu" />
										<Checkbox label="Ignore pinned tabs" />
									</div>
									<Button as="a" href="chrome://extensions/shortcuts" target="_blank" icon={ <KeyCommandRegular /> }>Change extension shortcuts</Button>
								</div>
								<div className="stack gap">
									<Label id="label-ExtensionBehavior" weight="semibold">Extension behavior</Label>
									<Dropdown aria-labelledby="label-ExtensionBehavior">
										<Option>Popup</Option>
										<Option>Tab + action</Option>
										<Option>Context menu</Option>
									</Dropdown>
									<Text as="p">
										<Text weight="semibold">Popup</Text><br />
										<Text><AppsRegular /> Click extension icon to access saved collections</Text>
									</Text>
									<Text as="p">
										<Text weight="semibold">Tab + action</Text><br />
										<Text><WindowRegular /> Extension will pin a new browser tab with your saved collection</Text><br />
										<Text><AppsRegular /> Click extension icon to set tabs aside (default action)</Text>
									</Text>
									<Text as="p">
										<Text weight="semibold">Context menu</Text><br />
										<Text><AppsRegular /> Click extension icon to set tabs aside (default action)</Text><br />
										<Text><CursorClickRegular /> Right-click to open context menu and access your saved tabs</Text>
									</Text>
								</div>
							</AccordionPanel>
						</AccordionItem>
						<AccordionItem value="defaults">
							<AccordionHeader icon={ <CheckmarkCircleRegular /> }>
								<Text as="h2" size={ 400 } weight="semibold">Default actions</Text>
							</AccordionHeader>
							<AccordionPanel className="stack gap">
								<div className="dropdown-grid">
									<Label id="label-CloudOverflowAction">Set aside</Label>
									<Dropdown aria-labelledby="label-CloudOverflowAction">
										<Option>All tabs</Option>
										<Option>All groups</Option>
										<Option>Selected tabs</Option>
										<Option>Active group</Option>
									</Dropdown>
									<Text size={ 200 }><InfoRegular /> Set current tab aside or select multiple by using CTRL or SHIFT</Text>

									<Label id="label-CloudOverflowAction">Restore</Label>
									<Dropdown aria-labelledby="label-CloudOverflowAction">
										<Option>Restore and remove</Option>
										<Option>Open without removing</Option>
									</Dropdown>

									<Label id="label-CloudOverflowAction">When saving all tabs</Label>
									<Dropdown aria-labelledby="label-CloudOverflowAction">
										<Option>Save each group as new collection</Option>
										<Option>Preserve grouping inside one collection</Option>
										<Option>Omit grouping</Option>
									</Dropdown>

									<Label id="label-CloudOverflowAction">When restoring collection with groups</Label>
									<Dropdown aria-labelledby="label-CloudOverflowAction">
										<Option>Use inner grouping if possible</Option>
										<Option>Restore whole collection as a new group</Option>
										<Option>Omit grouping</Option>
									</Dropdown>
								</div>
							</AccordionPanel>
						</AccordionItem>
						<AccordionItem value="cloud">
							<AccordionHeader icon={ <CloudRegular /> }>
								<Text as="h2" size={ 400 } weight="semibold">Cloud sync &amp; storage</Text>
							</AccordionHeader>
							<AccordionPanel className="stack horizontal space-between gap wrap">
								<div className="stack gap">
									<Switch label="Sync settings &amp; collections between browsers" />
									<div className="stack horizontal gap wrap">
										<Button as="a" icon={ <ArrowDownloadRegular /> }>Export data</Button>
										<Button as="a" icon={ <ArrowUploadRegular /> }>Import data</Button>
									</div>
								</div>
								<div className="stack gap">
									<ProgressBar
										label="Cloud storage capacity" showPercentage
										secondaryText={ `${this.state.storageUsed} of ${this.state.storageQuota} KiB` }
										value={ this.state.storageUsed }
										max={ this.state.storageQuota }
										warningPercentage={ 90 } />
									<div className="stack">
										<Label id="label-CloudOverflowAction">What to do when cloud storage capacity is exceeded</Label>
										<Dropdown aria-labelledby="label-CloudOverflowAction">
											<Option>Save new tabs locally</Option>
											<Option>Notify me</Option>
										</Dropdown>
									</div>
								</div>
							</AccordionPanel>
						</AccordionItem>
						<AccordionItem value="about">
							<AccordionHeader icon={ <InfoRegular /> }>
								<Text as="h2" size={ 400 } weight="semibold">About</Text>
							</AccordionHeader>
							<AccordionPanel className="stack gap">
								<Text as="p">
									Developed by Eugene Fox (<Link href="https://twitter.com/xfox111" target="_blank">@xfox111</Link>)
									<br />
									Licensed under <Link href="https://github.com/XFox111/TabsAsideExtension/blob/master/LICENSE" target="_blank">MIT license</Link>
								</Text>
								<Text as="p">
									Want to contribute translation for your language? <Link href="https://github.com/XFox111/TabsAsideExtension/blob/master/CONTRIBUTING.md" target="_blank">Read this to get started</Link>
								</Text>
								<Text as="p">
									<Link href="https://xfox111.net/" target="_blank">My website</Link>
									<br />
									<Link href="https://github.com/xfox111/PasswordGeneratorExtension" target="_blank">Source code</Link>
									<br />
									<Link href="https://github.com/XFox111/PasswordGeneratorExtension/releases/latest" target="_blank">Changelog</Link>
								</Text>

								<div className="stack horizontal gap">
									<Button
										as="a" target="_blank"
										href="mailto:feedback@xfox111.net"
										appearance="primary" icon={ <PersonFeedbackRegular /> }>

										Leave feedback
									</Button>

									<Button
										as="a" target="_blank"
										href="https://buymeacoffee.com/xfox111"
										className="bmc" appearance="primary" icon={ <BuyMeACoffee /> }>

										Buy me a coffee
									</Button>
								</div>
							</AccordionPanel>
						</AccordionItem>
					</Accordion>
				</article>
			</main>
		);
	}
}
