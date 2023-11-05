document
    .getElementById("enterButton")
    .addEventListener("click", function () {
        document.getElementById("clickHere").classList.add("hidden");
        document.getElementById("content").classList.remove("hidden");
        document.getElementById("username").classList.remove("hidden");
        document.getElementById("bgAudio").play();
        document.getElementById("bgVid").play();
    });

    document
    .getElementById("clickHere")
    .addEventListener("click", function () {
        document.getElementById("clickHere").classList.add("hidden");
        document.getElementById("bgAudio").play();
        document.getElementById("bgVid").play();
    });





    const typewriterElement = document.getElementById("typedText");
    let textIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let isLineVisible = true;
    
    function type(textList) {
        const currentText = textList[textIndex];
    
        // Create the typewriter effect with the visible text and line
        const visibleText = currentText.substring(0, charIndex);
        const typewriterText = `${visibleText}${isLineVisible ? '|' : ''}`;
        typewriterElement.textContent = typewriterText;
    
        // Adjust the charIndex and isDeleting flags
        if (isDeleting) {
            charIndex--;
        } else {
            charIndex++;
        }
    
        // Check if the typing is completed or deleted
        if (charIndex > currentText.length) {
            if (isLineVisible) {
                // Hide the line once typing is completed
                isLineVisible = false;
                setTimeout(() => type(textList, typewriterElement, textIndex, charIndex, isDeleting, isLineVisible), 300);
            } else {
                isDeleting = true;
                isLineVisible = true;
    
                // Delay before starting to delete
                setTimeout(() => type(textList, typewriterElement, textIndex, charIndex, isDeleting, isLineVisible), 500);
            }
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            textIndex++;
            if (textIndex === textList.length) {
                textIndex = 0;
            }
            // Delay before starting to type the next text
            setTimeout(() => type(textList, typewriterElement, textIndex, charIndex, isDeleting, isLineVisible), 500);
        } else {
            // Recursive call with setTimeout for typing or deleting
            const timeoutDuration = isLineVisible ? 50 : 100; // Adjust the timing for optimal speed
            setTimeout(() => type(textList, typewriterElement, textIndex, charIndex, isDeleting, isLineVisible), timeoutDuration);
        }
    }
    
    
    // Function to update the title with a typewriter effect
    function updateTitle(title) {
        let index = 0;
        let isDeleting = false;
    
        // Interval to update the title every 200 milliseconds
        const interval = setInterval(() => {
            // Build the title progressively
            if (!isDeleting) {
                const partialTitle = title.substring(0, index + 1);
                document.title = partialTitle;
                index++;
    
                // Start backspacing when the title is complete
                if (index === title.length) {
                    isDeleting = true;
                    index--;
                }
            } else {
                const partialTitle = title.substring(0, index);
                document.title = partialTitle;
                index--;
    
                // Restart typing when backspacing is complete
                if (index === 0) {
                    isDeleting = false;
                }
            }
        }, 250);
    }