document.addEventListener("DOMContentLoaded", function () {
    const emailInput = document.getElementById("email");
    const emailError = document.getElementById("email-error");
    const ticketForm = document.getElementById("ticket-form");
    const fileInput = document.getElementById("file-input");

    const inputInfo = document.getElementById("input-info");
    const removeBtn = document.getElementById("remove-btn");
    const changeBtn = document.getElementById("change-btn");

    const uploadLabel = document.getElementById('upload-label');
    const imagePreviewArea = document.getElementById('image-preview-area');
    const previewImage = document.getElementById('preview-image');
    const originalInputInfoText = inputInfo.textContent;

    emailInput.addEventListener("blur", function () {
        const email = emailInput.value;
        if (email) {
            validateEmail(email);
        }
    });

    ticketForm.addEventListener("submit", function (event) {
        event.preventDefault();
        if (!validateEmail(emailInput.value || "")) {
            alert("Please correct the errors before submitting.");
            return;
        }

        if (fileInput.files.length === 0 || !validateFileSize(fileInput.files[0])) {
            alert("Please upload a valid avatar image (max size: 512KB).");
            return;
        }

        const formData = new FormData(ticketForm);

        const fullName = formData.get('full-name') || 'you';
        const email = formData.get('email');
        const githubUsername = formData.get('github-username');
        const avatarFile = formData.get('avatar');

        document.querySelector("h1").innerHTML = `
            Congrats, <span class='text-gradient'>${fullName}</span>! Your ticket is ready.
        `;
        document.querySelector('.secure-message').innerHTML = `We've emailed your ticket to <span class='text-orange-500'>${email}</span> and will send updates in the run up to the event.`;

        document.getElementById('ticket-name').textContent = fullName;
        document.getElementById('ticket-github').textContent = githubUsername ? (githubUsername.startsWith('@') ? githubUsername : '@' + githubUsername) : '@awerks';
        if (avatarFile) {
            const reader = new FileReader();
            reader.onload = function (e) {
                document.getElementById('ticket-avatar').src = e.target.result;
            };
            reader.readAsDataURL(avatarFile);
        }

        ticketForm.hidden = true;
        document.querySelector('.ticket').classList.remove('hidden');
        document.querySelector('.ticket').classList.add('grid');

    });

    fileInput.addEventListener("change", function () {
        const file = fileInput.files[0];
        inputInfo.textContent = originalInputInfoText;
        inputInfo.classList.remove('text-red-400');

        if (file) {
            if (!validateFileSize(file)) {
                inputInfo.textContent = "File size exceeds 512KB. Please upload a smaller file.";
                inputInfo.classList.add('text-red-400');
                fileInput.value = "";
                uploadLabel.classList.remove('hidden');
                imagePreviewArea.classList.add('hidden');
                imagePreviewArea.classList.remove('flex');
                return;
            }

            const url = URL.createObjectURL(file);
            previewImage.src = url;
            previewImage.onload = function () {
                URL.revokeObjectURL(url);
            };

            uploadLabel.classList.add('hidden');
            imagePreviewArea.classList.remove('hidden');
            imagePreviewArea.classList.add('flex');

        } else {

            uploadLabel.classList.remove('hidden');
            imagePreviewArea.classList.add('hidden');
            imagePreviewArea.classList.remove('flex');
        }
    });

    removeBtn.addEventListener("click", function () {
        fileInput.value = "";
        previewImage.src = "";

        inputInfo.textContent = originalInputInfoText;
        inputInfo.classList.remove('text-red-400');

        uploadLabel.classList.remove('hidden');
        imagePreviewArea.classList.add('hidden');
        imagePreviewArea.classList.remove('flex');
    });

    changeBtn.addEventListener("click", function () {
        fileInput.click();
    });
    function validateEmail(email) {
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(email)) {
            emailError.classList.remove('hidden');
            emailError.classList.add('inline-flex');
            return false;
        } else {
            emailError.classList.remove('inline-flex');
            emailError.classList.add('hidden');
            return true;
        }
    }
    function validateFileSize(file) {
        const maxSize = 512 * 1024; // 512KB
        return file.size <= maxSize;
    }

});;
