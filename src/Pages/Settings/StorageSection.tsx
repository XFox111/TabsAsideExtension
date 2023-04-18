import React from "react";
import * as Fluent from "@fluentui/react-components";
import * as Icons from "@fluentui/react-icons";
import { Field, Alert } from "@fluentui/react-components/unstable";

import ext from "../../Utils/ext";
import CollectionOptimizer from "../../Utils/CollectionOptimizer";
import CollectionsRepository from "../../Services/Storage/CollectionsRepository";
import SettingsModel from "../../Models/Data/SettingsModel";
import SettingsRepository from "../../Services/Storage/SettingsRepository";
import CollectionModel from "../../Models/Data/CollectionModel";

interface IStates
{
	storageCapacity: number;
	storageUsed: number;
	importResult: "success" | "error" | "warning" | "none";
	importResultMsg?: string;
}

interface IProps
{
	settings: SettingsModel;
	settingsRepo: SettingsRepository;
}

export default class StorageSection extends React.Component<IProps, IStates>
{
	constructor(props: IProps)
	{
		super(props);

		this.state =
		{
			storageCapacity: ext?.storage.sync.QUOTA_BYTES / 1024,
			storageUsed: 0,
			importResult: "none"
		};
	}

	public async componentDidMount(): Promise<void>
	{
		let storageUsed = await ext?.storage.sync.getBytesInUse();
		this.setState({ storageUsed: parseFloat((storageUsed / 1024).toFixed(1)) });
	}

	public render(): JSX.Element
	{
		return (
			<Fluent.AccordionItem value="storage" className="StorageSection">
				<Fluent.AccordionHeader icon={ <Icons.CloudRegular /> }>
					<Fluent.Text as="h2" size={ 400 } weight="semibold">Storage &amp; cloud</Fluent.Text>
				</Fluent.AccordionHeader>

				<Fluent.AccordionPanel className="stack gap">
					<Field
						label={
							<Fluent.Text weight="semibold">Cloud storage capacity</Fluent.Text>
						}
						hint={ this.GetStorageBarLabel() }>

						<Fluent.ProgressBar
							color={ this.GetStorageBarColor() }
							value={ this.state.storageUsed / this.state.storageCapacity }
							max={ 1 }
							thickness="large" />
					</Field>

					{ this.state.importResult !== "none" &&
						<Alert
							intent={ this.state.importResult }
							action={ {
								icon: <Icons.DismissRegular />,
								onClick: () => this.setState({ importResult: "none" })
							} }>

							{ this.state.importResultMsg }
						</Alert>
					}

					<section className="stack horizontal gap">
						<Fluent.Button
							icon={ <Icons.ArrowDownloadRegular /> }
							onClick={ () => this.ExportData() }>

							Export data
						</Fluent.Button>
						<Fluent.Button
							icon={ <Icons.ArrowUploadRegular /> }
							onClick={ () => document.querySelector<HTMLInputElement>(".StorageSection #importFile")?.click() }>

							Import data
						</Fluent.Button>

						<input
							type="file"
							id="importFile"
							accept=".json,.data"
							onInput={ async e => await this.OnFileImport(e) }
							hidden />
					</section>
				</Fluent.AccordionPanel>
			</Fluent.AccordionItem>
		);
	}

	private GetStorageBarColor(): "brand" | "warning" | "error"
	{
		let percentage = this.state.storageUsed / this.state.storageCapacity;

		if (percentage < 0.75)
			return "brand";
		else if (percentage < 0.9)
			return "warning";
		else
			return "error";
	}

	private GetStorageBarLabel(): string
	{
		let percentage = this.state.storageUsed / this.state.storageCapacity;

		return `${this.state.storageUsed} of ${this.state.storageCapacity} KiB (${(percentage * 100).toFixed(0)}%)`;
	}

	private async ExportData(): Promise<void>
	{
		let element : HTMLAnchorElement = document.createElement("a");
		element.style.display = 'none';
		document.body.appendChild(element);

		let collections : string = CollectionOptimizer.SerializeCollections(await new CollectionsRepository().GetAsync());

		element.href = `data:text/plain;charset=utf-8,${collections}`;
		element.setAttribute("download", "collections.data");
		element.click();

		element.href = `data:text/plain;charset=utf-8,${JSON.stringify(this.props.settings)}`;
		element.setAttribute("download", "settings.json");
		element.click();

		document.body.removeChild(element);
	}

	private async OnFileImport(args: React.FormEvent<HTMLInputElement>): Promise<void>
	{
		args.preventDefault();

		this.setState({ importResult: "none" });

		if (args.currentTarget.files.length < 1)
			return

		let file: File = args.currentTarget.files[0];
		let content: string = await file.text();

		if (file.type === "application/json")
			try
			{
				let settings: SettingsModel = new SettingsModel(JSON.parse(content));
				this.props.settingsRepo.UpdateSettingsAsync(settings);
				this.setState({ importResult: "success", importResultMsg: "Settings were successfully imported" });
			}
			catch
			{
				this.setState({ importResult: "error", importResultMsg: "Provided file is not a vaild settings file" })
			}
		else if (file.name.endsWith(".data"))
			try
			{
				let importedCollections: CollectionModel[] = CollectionOptimizer.DeserializeCollections(content);

				if (importedCollections.length < 1)
				{
					this.setState({ importResult: "warning", importResultMsg: "Provided file does not contain any collections" });
					return;
				}

				let collectionsRepo: CollectionsRepository = new CollectionsRepository();
				let existingCollections: CollectionModel[] = await collectionsRepo.GetAsync();
				let collectionsToAdd: CollectionModel[] = importedCollections
					.filter(i => i.Timestamp && !existingCollections.some(j => j.Timestamp === i.Timestamp));

				await collectionsRepo.AddAsync(...collectionsToAdd);

				if (importedCollections.length > collectionsToAdd.length)
					this.setState({
						importResult: "warning",
						importResultMsg: `(${collectionsToAdd.length}) collections were successfully imported. Though (${importedCollections.length - collectionsToAdd.length}) collections failed to import (invalid or duplicate)`
					});
				else
					this.setState({
						importResult: "success",
						importResultMsg: `(${collectionsToAdd.length}) collections were successfully imported`
					});
			}
			catch
			{
				this.setState({ importResult: "error", importResultMsg: "Provided file is not a vaild collections data file" })
			}
		else
			this.setState({ importResult: "error", importResultMsg: "Provided file has invalid extension" })
	}
}
