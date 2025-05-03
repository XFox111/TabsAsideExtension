import { BuyMeACoffee20Regular } from "@/assets/BuyMeACoffee20";
import { buyMeACoffeeLink, storeLink } from "@/data/links";
import { useBmcStyles } from "@/hooks/useBmcStyles";
import extLink from "@/utils/extLink";
import { Button, Link, MessageBar, MessageBarActions, MessageBarBody, MessageBarProps, MessageBarTitle } from "@fluentui/react-components";
import { DismissRegular, HeartFilled } from "@fluentui/react-icons";
import { ReactElement } from "react";

export default function CtaMessage(props: MessageBarProps): ReactElement
{
	const [counter, setCounter] = useState<number>(0);
	const bmcCls = useBmcStyles();

	useEffect(() =>
	{
		ctaCounter.getValue().then(c =>
		{
			if (c >= 0)
			{
				setCounter(c);
				ctaCounter.setValue(c + 1);
			}
		});
	}, []);

	const resetCounter = async (counter: number) =>
	{
		await ctaCounter.setValue(counter);
		setCounter(counter);
	};

	if (counter < 50)
		return <></>;

	return (
		<MessageBar layout="multiline" icon={ <HeartFilled color="red" /> } { ...props }>
			<MessageBarBody>
				<MessageBarTitle>{ i18n.t("cta_message.title") }</MessageBarTitle>
				{ i18n.t("cta_message.message") } <Link { ...extLink(storeLink) }>{ i18n.t("cta_message.feedback") }</Link>
			</MessageBarBody>
			<MessageBarActions
				containerAction={
					<Button icon={ <DismissRegular /> } appearance="transparent" onClick={ () => resetCounter(0) } />
				}
			>
				<Button
					as="a" { ...extLink(buyMeACoffeeLink) }
					onClick={ () => resetCounter(-1) }
					appearance="primary"
					className={ bmcCls.button }
					icon={ <BuyMeACoffee20Regular /> }
				>
					{ i18n.t("common.cta.sponsor") }
				</Button>
			</MessageBarActions>
		</MessageBar>
	);
}

const ctaCounter = storage.defineItem<number>("local:ctaCounter", { fallback: 0 });
