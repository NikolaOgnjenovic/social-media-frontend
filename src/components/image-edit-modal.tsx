import React, {useRef} from "react";
// react-pintura
import {PinturaEditorModal} from "@pqina/react-pintura";

// pintura
import "@pqina/pintura/pintura.css";
import {
    createDefaultImageReader,
    createDefaultImageWriter,
    createDefaultShapePreprocessor,
    ImageSource,
    locale_en_gb,
    markup_editor_defaults,
    markup_editor_locale_en_gb,
    plugin_annotate,
    plugin_annotate_locale_en_gb,
    plugin_crop,
    plugin_crop_locale_en_gb,
    plugin_filter,
    plugin_filter_defaults,
    plugin_filter_locale_en_gb,
    plugin_finetune,
    plugin_finetune_defaults,
    plugin_finetune_locale_en_gb,
    setPlugins,
} from "@pqina/pintura";

setPlugins(plugin_crop, plugin_finetune, plugin_filter, plugin_annotate);

const editorDefaults = {
    utils: ["crop", "finetune", "filter", "annotate"],
    imageReader: createDefaultImageReader(),
    imageWriter: createDefaultImageWriter(),
    shapePreprocessor: createDefaultShapePreprocessor(),
    ...plugin_finetune_defaults,
    ...plugin_filter_defaults,
    ...markup_editor_defaults,
    locale: {
        ...locale_en_gb,
        ...plugin_crop_locale_en_gb,
        ...plugin_finetune_locale_en_gb,
        ...plugin_filter_locale_en_gb,
        ...plugin_annotate_locale_en_gb,
        ...markup_editor_locale_en_gb,
    },
};

interface Props {
    imageSource: ImageSource,
    visible: boolean,
    setVisible: React.Dispatch<any>,
    updateImage: (imageFile: File) => void;
}

const ImageEditModal: React.FC<Props> = ({imageSource, visible, setVisible, updateImage}) => {
    const editorRef = useRef(null);

    return (
        <>
            {
                visible && (
                    <PinturaEditorModal
                        ref={editorRef}
                        {...editorDefaults}
                        src={imageSource}
                        onProcess={({dest}) => updateImage(dest)}
                        onHide={() => setVisible(false)}
                        onClose={() => setVisible(false)}
                    />
                )
            }
        </>
    );
};

export default ImageEditModal;
