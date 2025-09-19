const phrasesDiv = document.getElementById('phrases');
const newPhraseInput = document.getElementById('newPhrase');
const addBtn = document.getElementById('addBtn');

function renderPhrases(phrases) {
  phrasesDiv.innerHTML = '';

  phrases.forEach((phrase, index) => {
    const div = document.createElement('div');
    div.className = 'phrase';

    const span = document.createElement('span');
    span.textContent = phrase;
    span.addEventListener('click', () => copyToClipboard(phrase));

    const del = document.createElement('img');
    del.src = 'trash.png';   // Use the trash can image
    del.className = 'delete';
    del.title = "Delete";
    del.addEventListener('click', (e) => {
      e.stopPropagation();   // prevent also copying text
      deletePhrase(index);
    });

    div.appendChild(span);
    div.appendChild(del);
    phrasesDiv.appendChild(div);
  });
}

function copyToClipboard(text) {
	navigator.clipboard.writeText(text).then(() => {
		showToast("Phrase Copied!");
	});
}

function addPhrase() {
	const phrase = newPhraseInput.value.trim();
	if (!phrase) return;

	chrome.storage.local.get({ phrases: [] }, (data) => {
		const updated = [...data.phrases, phrase];
		chrome.storage.local.set({ phrases: updated }, () => {
			renderPhrases(updated);
			newPhraseInput.value = '';
			showToast("Phrase Added!");
		});
	});
}

function deletePhrase(index) {
	chrome.storage.local.get({ phrases: [] }, (data) => {
		const updated = data.phrases.filter((_, i) => i !== index);
		chrome.storage.local.set({ phrases: updated }, () => {
			renderPhrases(updated);
			showToast("Phrase Deleted!");
		});
	});
}

function showToast(message) {
	const toast = document.getElementById("toast");
	toast.textContent = message;
	toast.classList.add("show");
	setTimeout(() => {
		toast.classList.remove("show");
	}, 1200);
}

// Load phrases on popup open
chrome.storage.local.get({ phrases: ["Thanks for trying out Phrasier! I hope you find it useful!"] }, (data) => {
	renderPhrases(data.phrases);
});

// Event listeners
addBtn.addEventListener('click', addPhrase);
newPhraseInput.addEventListener('keypress', (e) => {
	if (e.key === 'Enter') addPhrase();
});
