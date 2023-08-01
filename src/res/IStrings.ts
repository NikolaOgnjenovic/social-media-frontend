import {LocalizedStringsMethods} from "react-localization";

export interface IStrings extends LocalizedStringsMethods {
    en: {
        images: {
            noImageSelected: string;
            selectedImage: string;
            uploadImageTitle: string;
            imageTitlePlaceHolder: string;
            selectImage: string;
            createImageAlt: string;
            imageAlt: string;
            loadingImage: string;
            deleteImage: string;
            editImage: string;
            searchByTagsPlaceholder: string;
            searchByTitlePlaceholder: string;
            updateFolder: string;
            updateEditors: string;

            errors: {
                create: string;
                title: string;
                file: string;
                hashtags: string;
                load: string;
                like: string;
                delete: string;
                openEditors: string;
                updateEditors: string;
                openImageEditor: string;
                updateFile: string;
                updateImageFolder: string;
            }
        },

        comments: {
            leaveCommentPlaceholder: string;
            commentAlt: string;
            hideComments: string;
            showComments: string;
            deleteComment: string;

            errors: {
                load: string;
                text: string;
                upload: string;
                like: string;
                delete: string;
            }
        },

        folders: {
            allImages: string;
            createFolder: string;
            folderTitlePlaceholder: string;
            deleteFolder: string;
            editors: string;
            updateEditors: string;

            errors: {
                title: string;
                upload: string;
                delete: string;
                noFolders: string;
            }
        },

        navbar: {
            feed: string;
            folders: string;
            chart: string;
            logout: string;
            login: string;
            register: string;
            welcome: string;
        },

        auth: {
            login: string;
            register: string;
            username: string;
            password: string;

            errors: {
                invalidCredentials: string;
                jwt: string;
            }
        },

        chart: {
            title: string;
            loading: string;
            popularity: string;
            username: string;
        },

        hashtags: string;
        hashtagsPlaceholder: string;
        author: string;
        delete: string;
        like: string;
        unlike: string;
        likes: string;
        confirmationText: string;
        cancel: string;
        error: string;
        ok: string;
        confirm: string;
        serbian: string;
        english: string;
        editors: string;
    },

    rsCyrillic: {
        en: {
            images: {
                noImageSelected: string;
                selectedImage: string;
                uploadImageTitle: string;
                imageTitlePlaceHolder: string;
                selectImage: string;
                createImageAlt: string;
                imageAlt: string;
                loadingImage: string;
                deleteImage: string;
                editImage: string;
                searchByTagsPlaceholder: string;
                searchByTitlePlaceholder: string;
                updateFolder: string;
                updateEditors: string;

                errors: {
                    create: string;
                    title: string;
                    file: string;
                    hashtags: string;
                    load: string;
                    like: string;
                    delete: string;
                    openEditors: string;
                    updateEditors: string;
                    openImageEditor: string;
                    updateFile: string;
                    updateImageFolder: string;
                }
            },

            comments: {
                leaveCommentPlaceholder: string;
                commentAlt: string;
                hideComments: string;
                showComments: string;
                deleteComment: string;

                errors: {
                    load: string;
                    text: string;
                    upload: string;
                    like: string;
                    delete: string;
                }
            },

            folders: {
                allImages: string;
                createFolder: string;
                folderTitlePlaceholder: string;
                deleteFolder: string;
                editors: string;
                updateEditors: string;

                errors: {
                    title: string;
                    upload: string;
                    delete: string;
                    noFolders: string;
                }
            },

            navbar: {
                feed: string;
                folders: string;
                chart: string;
                logout: string;
                login: string;
                register: string;
                welcome: string;
            },

            auth: {
                login: string;
                register: string;
                username: string;
                password: string;

                errors: {
                    invalidCredentials: string;
                    jwt: string;
                }
            },

            chart: {
                title: string;
                loading: string;
                popularity: string;
                username: string;
            },

            hashtags: string;
            hashtagsPlaceholder: string;
            author: string;
            delete: string;
            like: string;
            unlike: string;
            likes: string;
            confirmationText: string;
            cancel: string;
            error: string;
            ok: string;
            confirm: string;
            serbian: string;
            english: string;
            editors: string;
        }
    }
}