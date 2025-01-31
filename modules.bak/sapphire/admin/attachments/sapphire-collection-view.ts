import {type AttachmentView, CollectionView} from "@nano-forge/hammer.common";
import {Icon, type IconType} from "modules/ui-tools";

export class SapphireCollectionView extends CollectionView {
	static namedImg = "SAPPHIRE";
	static getIcon(file: AttachmentView): IconType { return Icon.forFile(file.name);}
}