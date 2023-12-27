"use strict";
// Global variables
const api_key = "pUKpAc7UOqZHGsJ0lgjiuPKPRafCZALvwjXd1vT1";
const rovers = [];
const allManifests = {};

// DOM nodes
const roverValidation = document.querySelector("#rover-validation");
const cameraValidation = document.querySelector("#camera-validation");
const solValidation = document.querySelector("#sol-validation");
const spinner = document.querySelector("#spinner");
const carousel = document.querySelector("#carouselRoverPhotos");
const carouselItemHolder = document.querySelector("#carousel-items");
const errorModalBody = document.querySelector("#error-modal-body");
const ddlRovers = document.querySelector("#ddl-rover");
const userSol = document.querySelector("#martian-sol");
const ddlRoverCameras = document.querySelector("#ddl-rover-camera");
const roverInfoHolder = document.querySelector("#rover-info");
const roverName = document.querySelector("#rover-name");
const roverLaunchDate = document.querySelector("#rover-launch-date");
const roverLandDate = document.querySelector("#rover-land-date");
const roverDescription = document.querySelector("#rover-description");

// Error Messages
const photoErrorMsg =
    "Oops!\n\nThe Martian SOL you selected does not have any photos!\n\nPlease try another Martian SOL.";
const manifestErrorMsg =
    "Oops!\n\nThere was an issue requesting manifest info from the NASA API." +
    "\n\nPlease reload the page and try again. If the issue persists, contact your administrator.";
const roverErrorMsg =
    "Oops!\n\nThere was an issue requesting rover info from the NASA API." +
    "\n\nPlease reload the page and try again. If the issue persists, contact your administrator.";
const errorMsg =
    "Oops!\n\nThere was an issue getting the photos.\n\n" +
    "Please try again, if the issue persists, contact your administrator.";

function showErrorModal(message) {
  const errorModal = new bootstrap.Modal(
    document.querySelector("#error-modal")
  );
  errorModalBody.innerText = message;
  errorModal.show();
}

/*
  Code from: 
  https://www.javascripttutorial.net/dom/manipulating/remove-all-child-nodes/#:~:text=%20To%20remove%20all%20child%20nodes%20of%20a,there%20is%20no%20remaining%20child%20node.%20More%20
*/
function removeAllChildNodes(parentElm) {
  while (parentElm.firstChild) {
    parentElm.removeChild(parentElm.firstChild);
  }
}
/*
  End code from: 
  https://www.javascripttutorial.net/dom/manipulating/remove-all-child-nodes/#:~:text=%20To%20remove%20all%20child%20nodes%20of%20a,there%20is%20no%20remaining%20child%20node.%20More%20
*/

function capitalize(word) {
  // Capitalize the rover name: https://www.samanthaming.com/pictorials/how-to-capitalize-a-string/
  word = word.charAt(0).toUpperCase() + word.slice(1);
  // End capitalize the rover name: https://www.samanthaming.com/pictorials/how-to-capitalize-a-string/
  return word;
}

function populateDDLOptions(options) {
  let ddlOptions = "";
  options.forEach((option) => {
    ddlOptions += `<option value="${option.toLowerCase()}">${option}</option>`;
  });
  return ddlOptions;
}

function getRoversAndManifests() {
  const roversHttpRequest = new XMLHttpRequest();

  // Get rovers
  roversHttpRequest.onload = function () {
    if (roversHttpRequest.status === 200) {
      let roversObj = JSON.parse(roversHttpRequest.responseText).rovers;
      roversObj.forEach((rover) => {
        rovers.push(rover.name);
      });
      // Populate rover select list
      ddlRovers.innerHTML = populateDDLOptions(rovers);

      // Get manifests
      rovers.forEach((rover) => {
        const manifestsHttpReq = new XMLHttpRequest();
        manifestsHttpReq.onload = function () {
          if (manifestsHttpReq.status === 200) {
            let photoManifest = JSON.parse(
              manifestsHttpReq.responseText
            ).photo_manifest;
            allManifests[rover] = photoManifest;

            // From starter code: https://umsystem.instructure.com/courses/7093/pages/challenge-9-starter-information?module_item_id=3420835
            let updatedPhotos = {};
            allManifests[rover].photos.forEach((photo) => {
              updatedPhotos[photo.sol] = photo;
            });
            allManifests[rover].photos = updatedPhotos;
            // End starter code: https://umsystem.instructure.com/courses/7093/pages/challenge-9-starter-information?module_item_id=3420835
          } else {
            showErrorModal(manifestErrorMsg);
          }
        };
        manifestsHttpReq.open(
          "GET",
          `https://api.nasa.gov/mars-photos/api/v1/manifests/${rover}?api_key=${api_key}`,
          true
        );
        manifestsHttpReq.send();
      });
    } else {
      showErrorModal(roverErrorMsg);
    }
  };
  roversHttpRequest.open(
    "GET",
    `https://api.nasa.gov/mars-photos/api/v1/rovers?api_key=${api_key}`
  );
  roversHttpRequest.send();
}

function hideValidationFields() {
  if (!roverValidation.classList.contains("d-none")) {
    roverValidation.classList.add("d-none");
  }
  if (!solValidation.classList.contains("d-none")) {
    solValidation.classList.add("d-none");
  }
  if (!cameraValidation.classList.contains("d-none")) {
    cameraValidation.classList.add("d-none");
  }
}

function formIsValid() {
  if (ddlRovers.value === "" || ddlRovers.value === "0") {
    if (roverValidation.classList.contains("d-none")) {
      roverValidation.classList.remove("d-none");
    }
    return false;
  } else if (userSol.value === "") {
    if (solValidation.classList.contains("d-none")) {
      solValidation.classList.remove("d-none");
    }
    return false;
  } else if (ddlRoverCameras.value === "" || ddlRoverCameras.value === "0") {
    if (cameraValidation.classList.contains("d-none")) {
      cameraValidation.classList.remove("d-none");
    }
    return false;
  } else {
    hideValidationFields();
    return true;
  }
}

function solHasPhotos(userSol, rover) {
  if (allManifests[rover].photos[userSol] == null) {
    return false;
  } else {
    return true;
  }
}

function populateCameras() {
  const userSol = document.querySelector("#martian-sol").value;
  const selectedRover = document.querySelector("#ddl-rover").value;
  let selectString;
  rovers.forEach((rover) => {
    let cameras;
    if (selectedRover === rover.toLowerCase()) {
      if (!solHasPhotos(userSol, capitalize(selectedRover))) {
        showErrorModal(photoErrorMsg);
      } else {
        cameras = allManifests[rover].photos[userSol].cameras;
        selectString = populateDDLOptions(cameras);
      }
    }
    ddlRoverCameras.innerHTML = selectString;
  });
  hideValidationFields();
}

function populateCarouselItemHTML(photo) {
  const carouselItem =
    `<div class="carousel-item">
      <img src="${photo.img_src}" class="d-block w-100" alt="${photo.camera.full_name}" />
      <div class="carousel-caption bg-secondary bg-gradient bg-opacity-25 d-md-block">
        <h5 class="mb-1">${photo.rover.name}</h5>
        <p class="mb-1">${photo.camera.full_name}</p>
        <p class="mb-1">${photo.earth_date}</p>
      </div>
    </div>`;
  return carouselItem;
}

function populateRoverInfo(selectedRover) {
  selectedRover = capitalize(selectedRover);

  roverName.innerText = "";
  roverLaunchDate.innerText = "";
  roverLandDate.innerText = "";
  roverDescription.innerText = "";

  if (roverInfoHolder.classList.contains("d-none")) {
    roverInfoHolder.classList.remove("d-none");
  }

  roverName.innerText = selectedRover;
  roverLaunchDate.innerText = allManifests[selectedRover].launch_date;
  roverLandDate.innerText = allManifests[selectedRover].landing_date;

  if (selectedRover === "Spirit") {
    // Description from: https://en.wikipedia.org/wiki/Spirit_(rover)
    roverDescription.innerText = `Spirit, also known as MER-A (Mars Exploration Rover – A) or MER-2, is a robotic rover on Mars, active from 2004 to 2010. Spirit was operational on Mars for 2208 sols (2249 days; 6 years, 77 days). It was one of two rovers of NASA's Mars Exploration Rover Mission managed by the Jet Propulsion Laboratory (JPL). Spirit landed successfully within the impact crater Gusev on Mars at 04:35 Ground UTC on January 4, 2004, three weeks before its twin, Opportunity (MER-B), which landed on the other side of the planet. Its name was chosen through a NASA-sponsored student essay competition. The rover became stuck in a "sand trap" in late 2009 at an angle that hampered recharging of its batteries; its last communication with Earth was sent on March 22, 2010.`;
    // End description from: https://en.wikipedia.org/wiki/Spirit_(rover)
  } else if (selectedRover === "Opportunity") {
    // Description from: https://en.wikipedia.org/wiki/Opportunity_(rover)
    roverDescription.innerText = `Opportunity, also known as MER-B (Mars Exploration Rover – B) or MER-1, and nicknamed "Oppy," is a robotic rover that was active on Mars from 2004 until mid-2018. Opportunity was operational on Mars for 5110 sols (5250 days; 14 years, 136 days). Launched on July 7, 2003, as part of NASA's Mars Exploration Rover program, it landed in Meridiani Planum on January 25, 2004, three weeks after its twin Spirit (MER-A) touched down on the other side of the planet. With a planned 90-sol duration of activity (slightly less than 92.5 Earth days), Spirit functioned until it got stuck in 2009 and ceased communications in 2010, while Opportunity was able to stay operational for 5111 sols after landing, maintaining its power and key systems through continual recharging of its batteries using solar power, and hibernating during events such as dust storms to save power. This careful operation allowed Opportunity to operate for 57 times its designed lifespan, exceeding the initial plan by 14 years, 46 days (in Earth time). By June 10, 2018, when it last contacted NASA, the rover had traveled a distance of 45.16 kilometers (28.06 miles).`;
    // End description from: https://en.wikipedia.org/wiki/Opportunity_(rover)
  } else if (selectedRover === "Curiosity") {
    // Description from: https://en.wikipedia.org/wiki/Curiosity_(rover)
    roverDescription.innerText = `Curiosity is a car-sized Mars rover designed to explore the Gale crater on Mars as part of NASA's Mars Science Laboratory (MSL) mission. Curiosity was launched from Cape Canaveral (CCAFS) on 26 November 2011, at 15:02:00 UTC and landed on Aeolis Palus inside Gale crater on Mars on 6 August 2012, 05:17:57 UTC. The Bradbury Landing site was less than 2.4 km (1.5 mi) from the center of the rover's touchdown target after a 560 million km (350 million mi) journey.

    The rover's goals include an investigation of the Martian climate and geology, assessment of whether the selected field site inside Gale has ever offered environmental conditions favorable for microbial life (including investigation of the role of water), and planetary habitability studies in preparation for human exploration.
    
    In December 2012, Curiosity's two-year mission was extended indefinitely, and on 5 August 2017, NASA celebrated the fifth anniversary of the Curiosity rover landing. The rover is still operational, and as of November 4, 2021, Curiosity has been active on Mars for 3287 sols (3377 total days; 9 years, 90 days) since its landing`;
    // End description from: https://en.wikipedia.org/wiki/Curiosity_(rover)
  } else if (selectedRover === "Perseverance") {
    // Description from: https://en.wikipedia.org/wiki/Perseverance_(rover)
    roverDescription.innerText = `Perseverance, nicknamed Percy, is a car-sized Mars rover designed to explore the crater Jezero on Mars as part of NASA's Mars 2020 mission. It was manufactured by the Jet Propulsion Laboratory and launched on 30 July 2020, at 11:50 UTC. Confirmation that the rover successfully landed on Mars was received on 18 February 2021, at 20:55 UTC. As of 4 November 2021, Perseverance has been active on Mars for 252 sols (259 Earth days) since its landing. Following the rover's arrival, NASA named the landing site Octavia E. Butler Landing.

    Perseverance has a similar design to its predecessor rover, Curiosity, from which it was moderately upgraded. It carries seven primary payload instruments, nineteen cameras, and two microphones. The rover also carried the mini-helicopter Ingenuity to Mars, an experimental aircraft and technology showcase that made the first powered flight on another planet on 19 April 2021. Since its first flight, Ingenuity has made 12 more flights for a total of 13 powered flights on another planet.
    
    The rover's goals include identifying ancient Martian environments capable of supporting life, seeking out evidence of former microbial life existing in those environments, collecting rock and soil samples to store on the Martian surface, and testing oxygen production from the Martian atmosphere to prepare for future crewed missions.`;
    //End description from: https://en.wikipedia.org/wiki/Perseverance_(rover)
  }
}

function changeRover() {
  userSol.value = "";
  removeAllChildNodes(carouselItemHolder);
  removeAllChildNodes(ddlRoverCameras);
  ddlRoverCameras.innerHTML = `<option value="0">Please input a Sol first</option>`;
  if (!carousel.classList.contains("d-none")) {
    carousel.classList.add("d-none");
  }
  roverName.innerText = "";
  roverLaunchDate.innerText = "";
  roverLandDate.innerText = "";
  roverDescription.innerText = "";
  if (!roverInfoHolder.classList.contains("d-none")) {
    roverInfoHolder.classList.add("d-none");
  }
}

function populatePicsAndInfo() {
  const userSol = document.querySelector("#martian-sol").value;
  const selectedCamera = document.querySelector("#ddl-rover-camera").value;
  const selectedRover = document.querySelector("#ddl-rover").value;

  if (!carousel.classList.contains("d-none")) {
    carousel.classList.add("d-none");
  }
  if (formIsValid()) {
    if (solHasPhotos(userSol, capitalize(selectedRover))) {
      if (spinner.classList.contains("d-none")) {
        spinner.classList.remove("d-none");
      }
      const httpReq = new XMLHttpRequest();
      httpReq.onload = function () {
        if (httpReq.status === 200) {
          const photos = JSON.parse(httpReq.responseText).photos;
    
          if (photos.length > 0) {
            if (!spinner.classList.contains("d-none")) {
              spinner.classList.add("d-none");
            }
            if (carouselItemHolder.childNodes.length > 0) {
              removeAllChildNodes(carouselItemHolder);
            }
            if (carousel.classList.contains("d-none")) {
              carousel.classList.remove("d-none");
            }
            photos.forEach((photo) => {
              carouselItemHolder.innerHTML += populateCarouselItemHTML(photo);
            });
            carouselItemHolder.firstElementChild.classList.add("active");
            populateRoverInfo(selectedRover);
          }
        } else {
          showErrorModal(errorMsg);
        }
      };
      httpReq.open(
        "GET",
        `https://api.nasa.gov/mars-photos/api/v1/rovers/` +
          `${selectedRover}/photos?sol=${userSol}&camera=${selectedCamera}&api_key=${api_key}`,
        true
      );
      httpReq.send(); 
    } else {
      showErrorModal(photoErrorMsg);
    }
  }
}
