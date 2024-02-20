function updateContent() {
    fetch('https://api.github.com/repos/cgi2024/it/contents/it.txt', {
        method: 'PUT',
        headers: {
            'Authorization': 'Bearer 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',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            message: 'Update content from website',
            content: btoa('New content added from website'),
            branch: 'main',
        }),
    })
    .then(response => response.json())
    .then(data => console.log(data))
    .catch(error => console.error(error));
}
