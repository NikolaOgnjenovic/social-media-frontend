import LocalizedStrings from 'react-localization';

export const localizedStrings = new LocalizedStrings({
    en: {
        images: {
            noImageSelected: "No image selected",
            selectedImage: "Selected image: ",
            uploadImageTitle: "Upload an image",
            imageTitlePlaceHolder: "Image title",
            selectImage: "Select an image",
            createImageAlt: "Create image",
            imageAlt: "Image: ",
            loadingImage: "Loading image...",
            deleteImage: "Delete image",
            editImage: "Edit image",
            searchByTagsPlaceholder: "Search images by tags",
            searchByTitlePlaceholder: "Search images by title",
            updateFolder: "Update folder",
            updateEditors: "Update editors",

            errors: {
                create: "Failed to create image. Проверите да ли сте повезани на интернет и покушајте поново.",
                title: "Please input a title for your image",
                file: "Please upload your image.",
                hashtags: "Please input some hashtags for your image.",
                load: "Failed to load images",
                like: "Failed to like image. Проверите да ли сте повезани на интернет и покушајте поново.",
                delete: "Failed to delete image. Проверите да ли сте повезани на интернет и покушајте поново.",
                openEditors: "There are no other users on this website. Tell your friends about it! Please.",
                updateEditors: "Failed to update image editors. Проверите да ли сте повезани на интернет и покушајте поново.",
                openImageEditor: "Failed to open image editing dialog because the image is missing. Проверите да ли сте повезани на интернет и покушајте поново.",
                updateFile: "Failed to update image file. Проверите да ли сте повезани на интернет и покушајте поново.",
                updateImageFolder: "Failed to update image folder. Проверите да ли сте повезани на интернет и покушајте поново."
            }
        },

        comments: {
            leaveCommentPlaceholder: "Leave a comment",
            commentAlt: "Comment",
            hideComments: "Hide comments",
            showComments: "Show comments",
            deleteComment: "Delete comment",

            errors: {
                load: "Failed to load comments",
                text: "Please input a message for your comment.",
                upload: "Failed to create comment. Проверите да ли сте повезани на интернет и покушајте поново.",
                like: "Failed to like comment. Проверите да ли сте повезани на интернет и покушајте поново.",
                delete: "Failed to delete comment. Проверите да ли сте повезани на интернет и покушајте поново.",
            }
        },

        folders: {
            allImages: "All of your images",
            createFolder: "Create a folder",
            folderTitlePlaceholder: "Folder title",
            deleteFolder: "Delete folder",
            editors: "Editors: ",
            updateEditors: "Update editors",

            errors: {
                title: "Please input a title for your folder.",
                upload: "Failed to create folder. Проверите да ли сте повезани на интернет и покушајте поново.",
                delete: "Failed to delete folder. Проверите да ли сте повезани на интернет и покушајте поново.",
                noFolders: "You haven't created any folders. Please create one in order to organize your images."
            }
        },

        navbar: {
            feed: "Feed",
            folders: "Folders",
            chart: "User popularity chart",
            logout: "Logout",
            login: "Login",
            register: "Register",
            welcome: "Welcome"
        },

        auth: {
            login: "Login",
            register: "Register",
            username: "Username",
            password: "Password",

            errors: {
                invalidCredentials: "Invalid credentials",
                jwt: "Failed to invalidate jwt token"
            }
        },

        chart: {
            title: "Top 5 most popular users",
            loading: "Loading chart...",
            popularity: "Popularity",
            username: "Username"
        },

        hashtags: "Hashtags:",
        hashtagsPlaceholder: "#input #image #hashtags",
        author: "Author: ",
        delete: "Delete",
        like: "Like",
        unlike: "Unlike",
        likes: "likes",
        confirmationText: "Are you sure? You can't undo this action afterwards.",
        cancel: "Cancel",
        error: "ERROR",
        ok: "OK",
        confirm: "Confirm",
        serbian: "Serbian",
        english: "English",
        editors: "Editors: "
    },

    rsCyrillic: {
        images: {
            noImageSelected: "Нема изабране слике",
            selectedImage: "Изабрана слика: ",
            uploadImageTitle: "Окачи слику",
            imageTitlePlaceHolder: "Наслов слике",
            selectImage: "Изабери слику",
            createImageAlt: "Окачи слику",
            imageAlt: "Слика: ",
            loadingImage: "Слика се учитава...",
            deleteImage: "Избриши слику",
            editImage: "Измени слику",
            searchByTagsPlaceholder: "Претражи слике према ознакама",
            searchByTitlePlaceholder: "Претражи слике према наслову",
            updateFolder: "Измени датотеку",
            updateEditors: "Измени уреднике",

            errors: {
                create: "Грешка при качењу слике. Проверите да ли сте повезани на интернет и покушајте поново.",
                title: "Унесите наслов за слику.",
                file: "Унесите датотеку слике.",
                hashtags: "Унесите ознаке слике.",
                load: "Грешка при учитавању слика",
                like: "Грешка при свиђању слике. Проверите да ли сте повезани на интернет и покушајте поново.",
                delete: "Грешка при брисању слике. Проверите да ли сте повезани на интернет и покушајте поново.",
                openEditors: "Нема других корисника на овом вебсајту. Причај људима о њему! Молим те.",
                updateEditors: "Грешка при измени уредника Проверите да ли сте повезани на интернет и покушајте поново.",
                openImageEditor: "Грешка при отварању прозора за измену слике јер датотека слике није пронађена.",
                updateFile: "Грешка при измени фајла слике. Проверите да ли сте повезани на интернет и покушајте поново.",
                updateImageFolder: "Грешка при измени датотеке слике. Проверите да ли сте повезани на интернет и покушајте поново."
            }
        },

        comments: {
            leaveCommentPlaceholder: "Коментариши нешто",
            commentAlt: "Коментариши",
            hideComments: "Сакриј коментаре",
            showComments: "Прикажи коментаре",
            deleteComment: "Избриши коментар",

            errors: {
                load: "Грешка при учитавању коментара.",
                text: "Унеси текст коментара.",
                upload: "Грешка при качењу коментара. Проверите да ли сте повезани на интернет и покушајте поново.",
                like: "Грешка при свиђању коментара. Проверите да ли сте повезани на интернет и покушајте поново.",
                delete: "Грешка при брисању коментара. Проверите да ли сте повезани на интернет и покушајте поново.",
            }
        },

        folders: {
            allImages: "Све твоје слике",
            createFolder: "Направи датотеку",
            folderTitlePlaceholder: "Назив датотеке",
            deleteFolder: "Избриши датотеку",
            editors: "Уредници: ",
            updateEditors: "Измени уреднике",

            errors: {
                title: "Унеси назив датотеке.",
                upload: "Грешка при качењу датотеке. Проверите да ли сте повезани на интернет и покушајте поново.",
                delete: "Грешка при брисању датотеке. Проверите да ли сте повезани на интернет и покушајте поново.",
                noFolders: "Ниси направио ниједну датотеку. Направи датотеку да би лакше организовао слике."
            }
        },

        navbar: {
            feed: "Све објаве",
            folders: "Датотеке",
            chart: "График популарности корисника",
            logout: "Одјави се",
            login: "Пријави се",
            register: "Региструј се",
            welcome: "Добродошао, "
        },

        auth: {
            login: "Пријави се",
            register: "Региструј се",
            username: "Корисничко име",
            password: "Лозинка",

            errors: {
                invalidCredentials: "Погрешни креденцијали",
                jwt: "Неуспех при валидацији jwt токена"
            }
        },

        chart: {
            title: "5 најпопуларнијих корисника",
            loading: "Учитавање графикона...",
            popularity: "Популарност",
            username: "Корисничко име"
        },

        hashtags: "Ознаке:",
        hashtagsPlaceholder: "#унеси #ознакe #слике",
        author: "Аутор: ",
        delete: "Избриши",
        like: "Свиђање",
        unlike: "Несвиђање",
        likes: "свиђања",
        confirmationText: "Да ли си сигуран? Нећеш моћи да поништиш ову акцију.",
        cancel: "Одустани",
        error: "ГРЕШКА",
        ok: "OK",
        confirm: "Потврди",
        serbian: "Српски",
        english: "Енглески",
        editors: "Уредници: "
    }
});