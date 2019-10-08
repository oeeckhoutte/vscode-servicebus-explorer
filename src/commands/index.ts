import { IDisposable } from "../disposable";
import { ServiceBusProvider } from "../providers/serviceBusProvider";
import { commands, window, Uri, workspace, ExtensionContext } from "vscode";
import { NameSpace } from "../namespace/namespace";
import { NameSpaceItem } from "../namespace/namespaceItem";
import { TopicList } from "../topic/topicList";
import { QueueList } from "../queue/queueList";
import { Subscription } from "../topic/subscription";
import { SubscriptionUI } from "../topic/SubscriptionUI";

export default function registerCommands(context: ExtensionContext, serviceBusProvider: ServiceBusProvider, nameSpace: NameSpace, subscriptionUI: SubscriptionUI) : IDisposable[] {
	return [
		commands.registerCommand('serviceBusExplorer.refreshEntry', () => serviceBusProvider.reBuildTree()),

		commands.registerCommand('serviceBusExplorer.addEntry', async () => {
			var state = await nameSpace.addNamespace();
			await serviceBusProvider.addNamespace({ name: state.name, connection: state.connectionString });
		}),

		commands.registerCommand('serviceBusExplorer.editEntry', async (node: NameSpaceItem) => {
			var state = await nameSpace.editNamespace(node);
			await serviceBusProvider.editNamespace(node, { name: state.name, connection: state.connectionString });
		}),

		commands.registerCommand('serviceBusExplorer.deleteEntry', (node: NameSpaceItem) => serviceBusProvider.deleteNamespace(node)),

		commands.registerCommand('serviceBusExplorer.refreshTopicList', (node: TopicList) => window.showInformationMessage('Refresh Topic List not implemented!')),

		commands.registerCommand('serviceBusExplorer.refreshQueueList', (node: QueueList) => window.showInformationMessage('Refresh Queue List not implemented!')),

		commands.registerCommand('serviceBusExplorer.getSubscriptionMessages', async (node: Subscription) => await node.getSubscriptionMessages(context)),
		commands.registerCommand('serviceBusExplorer.searchMessage', async (node: Subscription) => {
			var state  = await  subscriptionUI.searchMessages();
			await node.searchMessages(context, state.searchArguments);
		}),
		
		commands.registerCommand('serviceBusExplorer.showMessage', async (topic: string, subscription: string, message: any) => {
			let uri = Uri.parse(`servicebusmessage:message_${message.messageId}.json?topic=${topic}&subscription=${subscription}&messageid=${message.messageId}`);
			let doc = await workspace.openTextDocument(uri); // calls back into the provider
			await window.showTextDocument(doc, { preview: false });
		})
	];
}