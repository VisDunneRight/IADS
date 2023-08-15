# Immersive Analytics Design Space Survey Website
This repository hosts the code, data, and deployment for the companion website for the paper: [Unraveling the Design Space of Immersive Analytics:
A Systematic Review](https://osf.io/5ewaj/). The Survey website source codeis a fork version of the [Indy Survey Tool](https://github.com/VisDunneRight/Indy-Survey-Tool), a framework to unearth correlations in survey data.

If you found this website useful for your research, please make sure to cite it. 

- [Adding papers](#contributing)
- [Running the Webpage](#running-the-webpage)
  - [`npm install`](#npm-install)
  - [`npm run prepare`](#npm-run-prepare)
  - [`npm run dev`](#npm-run-dev)
    
##  Contributing
If you would like to add relevant papers to the survey website database, follow these steps. We ask that you please read our paper first to familiarize yourself with our categorization dimensions, categories, and codes.

1. Hit the ADD Entry button at the top right of the website. This will open a popup with instructions and a form.
  ![image](https://github.com/VisDunneRight/IA-Survey/assets/7236305/f063bcfd-245a-467f-97e7-b343addbe8ea)

2. Fill out the form. Any new tags can be added by typing into the field and selecting add from the dropdown.
  <img src="https://github.com/VisDunneRight/IA-Survey/assets/7236305/602983b2-108d-4fff-99aa-f2a40c3fb4b3" atl="Image of form" width="400">

  ![image](https://github.com/VisDunneRight/IA-Survey/assets/7236305/87b21651-e6c7-4116-85b4-c5a47021782d)

4. Hit the Copy to Clipboard.

  ![image](https://github.com/VisDunneRight/IA-Survey/assets/7236305/fde1ab7b-1fd0-4cea-9029-272c1cc37238)

6. From this repo, navigate to the issues tab -> create new issue 

7. Paste the copied JSON string into the issue body, use your paper title as the issue title, and add the "New Paper" tag. When you submit the issue, a pull request will be auto-generated.

![image](https://github.com/VisDunneRight/IADesign.Space/blob/main/public/images/issueguide.png)

8. The repo maintainers will review the pull request and respond with any follow-up or discussion questions to ensure the new paper is relevant to the survey and the information is accurate and consistent. Pull requests will stay open for at least 7 days to give maintainers a chance to review. 

9. Once the pull request is accepted, the survey website will automatically rebuild to reflect the new paper. 

10. If you submit a successful pull request, you will be given the option to become one of the repo maintainers to be able to review future new paper additions. We ask that maintainers try not to review their own pull requests. 

## Running the Webpage
If you decide to clone or fork this project, you can run it locally as follow.
In the project directory, you can run the following:

### `npm install`

Install all the libraries you need to get the app running using the list from `package.json`.

### `npm run prepare`

Run this command prior to `npm run dev` to update the webpage with any changes.

### `npm run dev`

Runs the site locally in development mode.<br />
It should provide a link to localhost to view the site in your browser.

