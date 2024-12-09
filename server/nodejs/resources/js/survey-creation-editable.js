function updateQuestionContent(selectElement) {
    const questionContent = selectElement.closest(".question-content");
    const optionsContainer = questionContent.querySelector(".options");
    const buttonContainer = questionContent.querySelector(".button-container");
    const questionType = selectElement.value;

    optionsContainer.innerHTML = '';
    buttonContainer.style.display = (questionType === 'multiple-choice' || questionType === 'checkbox') ? 'block' : 'none';

    switch (questionType) {
        case 'multiple-choice':
            addOption(buttonContainer.querySelector(".option-button"));
            break;
        case 'checkbox':
            addOption(buttonContainer.querySelector(".option-button"));
            break;
        case 'essay':
            optionsContainer.innerHTML = `<textarea placeholder="Enter an answer here" rows="4" cols="50" disabled class="textarea"></textarea>`;
            break;
        case 'rating':
            const ratingContainer = document.createElement("div");
            ratingContainer.classList.add("rating-container");

            ratingContainer.style.display = "flex";
            ratingContainer.style.gap = "10px";
            ratingContainer.style.marginBottom = "10px";

            const maxRatingSelect = document.createElement("select");
            maxRatingSelect.classList.add("max-rating-select");
            maxRatingSelect.style.marginBottom = "10px";

            for (let i = 1; i <= 10; i++) {
                const option = document.createElement("option");
                option.value = i;
                option.textContent = i;
                maxRatingSelect.appendChild(option);
            }

            maxRatingSelect.addEventListener("change", () => {
                const maxRating = parseInt(maxRatingSelect.value, 10);
                ratingContainer.innerHTML = "";

                for (let i = 1; i <= maxRating; i++) {
                    const label = document.createElement("label");
                    label.style.display = "flex";
                    label.style.alignItems = "center";

                    const radio = document.createElement("input");
                    radio.type = "radio";
                    radio.name = "rating";
                    radio.value = i;
                    radio.style.marginRight = "5px";

                    label.appendChild(radio);
                    label.appendChild(document.createTextNode(i));
                    ratingContainer.appendChild(label);
                }
            });

            optionsContainer.appendChild(maxRatingSelect);
            optionsContainer.appendChild(ratingContainer);
            break;
    }
}
