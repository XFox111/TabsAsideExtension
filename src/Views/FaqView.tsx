import { Text, Accordion, AccordionItem, AccordionHeader, AccordionPanel, Button, Title2, Tooltip } from "@fluentui/react-components";
import { StarEmphasisRegular, RoadConeRegular, BugRegular, ChevronLeftRegular, HistoryRegular, ImageRegular, PhoneVerticalScrollRegular, TagSearchRegular, GroupListRegular } from "@fluentui/react-icons";
import React from "react";

export default class FaqView extends React.Component
{
	public render(): JSX.Element
	{
		return (
			<main className="FaqView">
				<header className="stack horizontal gap">
					<Tooltip content="Back" relationship="label">
						<Button as="a" href="#" icon={ <ChevronLeftRegular /> } appearance="subtle" />
					</Tooltip>
					<Title2 as="h1">Help &amp; FAQ</Title2>
				</header>
				<article>
					<Accordion collapsible>
						<AccordionItem value="capabilities">
							<AccordionHeader icon={ <StarEmphasisRegular /> }>New capabilities</AccordionHeader>
							<AccordionPanel className="stack gap">
								<Text as="p">
									<Text weight="semibold"><PhoneVerticalScrollRegular /> Scroll position</Text><br />
									<Text>Extension now remembers where you left off on the page</Text>
								</Text>
								<Text as="p">
									<Text weight="semibold"><TagSearchRegular /> Search &amp; filters</Text><br />
									<Text>You can now search through your saved collections, filter and sort them</Text>
								</Text>
								<Text as="p">
									<Text weight="semibold"><GroupListRegular /> Tab groups</Text><br />
									<Text>Extension now can save and restore groups of tabs, preserving content and group colors</Text>
								</Text>
							</AccordionPanel>
						</AccordionItem>
						<AccordionItem value="notWorking">
							<AccordionHeader icon={ <RoadConeRegular /> }>What extension can't do</AccordionHeader>
							<AccordionPanel className="stack gap">
								<Text as="p">
									<Text weight="semibold"><HistoryRegular /> Save tab history</Text><br />
									<Text>Unfortunately, extension capabilities don't allow to access specific tab history. So when you restore your tabs, there will be no back/forward navigation</Text>
								</Text>
							</AccordionPanel>
						</AccordionItem>
						<AccordionItem value="knownIssues">
							<AccordionHeader icon={ <BugRegular /> }>Known issues</AccordionHeader>
							<AccordionPanel className="stack gap">
								<Text as="p">
									<Text weight="semibold"><ImageRegular /> Tab thumbnails</Text><br />
									<Text>Sometimes thumbnails on saved tabs may not appear from the begining or disappear eventually</Text><br />
									<Text>Thumbnails are generated when you focus on a completely loaded tab and are not saved in the cloud</Text>
								</Text>
							</AccordionPanel>
						</AccordionItem>
					</Accordion>
				</article>
			</main>
		);
	}
}
