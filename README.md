# Social media website frontend

***

## Description

This project is the frontend of a web application that I made during the Scala internship in Novalite doo.
The application is a simple social media prototype which includes authentication using JWT, image uploading & editing,
commenting images, liking images & comments, organizing images into personal folders, enabling other
users to edit your images, basic image and comment-related CRUD operations, search fields related to image titles &
tags, a chart which displays the most popular users...

## Running

To run the frontend at localhost:5173, use

    docker-compose up

To build the frontend for production, use

    vite build

## Usage

After registering or logging take a look at the feed page.

Upload an image by inputting the image title and hashtags, uploading & editing the file.
Search images by their title and tags using the search fields.
Like images that appear on your feed.
Leave a comment by inputting some text and pressing the comment button.
Like comments that appear once you press show comments under an image.

On the folders page, create a folder by inputting the title of the folder.
Organize images into folders, delete images & folders, assign other users editing permissions to your images and edit
your images.

## Authors and acknowledgment

Author: Nikola Ognjenović https://github.com/NikolaOgnjenovic

A huge thank you to NovaLite doo and their employees, and especially my mentor Marko Stanić for guiding me
through the 3-week development this project (and the Scala backend).

## License

GNU GPLv3, see LICENSE.md