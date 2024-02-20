function updateContent() {
    // 获取输入框的内容
    const newContent = document.getElementById('contentInput').value;

    // 使用 GitHub API 将新内容添加到 it.txt 文件中
    fetch('https://api.github.com/repos/cgi2024/it/contents/it.txt', {
        method: 'GET',
        headers: {
            'Authorization': 'Bearer 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',
            'Content-Type': 'application/json',
        },
    })
    .then(response => response.json())
    .then(data => {
        const currentContent = atob(data.content);

        // 追加新内容
        const updatedContent = currentContent + '\n' + newContent;

        // 使用 GitHub API 更新 it.txt 文件内容
        fetch('https://api.github.com/repos/cgi2024/it/contents/it.txt', {
            method: 'PUT',
            headers: {
                'Authorization': 'Bearer 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',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                message: 'Update content from website',
                content: btoa(updatedContent),
                branch: 'main',
            }),
        })
        .then(response => response.json())
        .then(data => console.log(data))
        .catch(error => console.error(error));
    })
    .catch(error => console.error(error));
}
