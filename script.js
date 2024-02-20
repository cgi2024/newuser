function updateContent() {
    // 获取输入框的内容
    const newContent = document.getElementById('contentInput').value;

    // 使用 GitHub API 获取当前 it.txt 文件的信息，包括 Commit SHA
    fetch('https://api.github.com/repos/cgi2024/it/contents/it.txt', {
        method: 'GET',
        headers: {
            'Authorization': 'Bearer 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',
            'Content-Type': 'application/json',
        },
    })
    .then(response => response.json())
    .then(data => {
        const currentContent = decodeURIComponent(escape(atob(data.content))); // 修改这一行
        const currentSha = data.sha;

        // 追加新内容
        const updatedContent = currentContent + '\n' + newContent;

        // 使用 GitHub API 更新 it.txt 文件内容
        fetch('https://api.github.com/repos/cgi2024/it/git/blobs', {
            method: 'POST',
            headers: {
                'Authorization': 'Bearer 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',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                content: btoa(unescape(encodeURIComponent(updatedContent))), // 修改这一行
                encoding: 'base64',
            }),
        })
        .then(response => response.json())
        .then(blobData => {
            const newSha = blobData.sha;

            // 使用 GitHub API 创建一个新的树对象
            fetch('https://api.github.com/repos/cgi2024/it/git/trees', {
                method: 'POST',
                headers: {
                    'Authorization': 'Bearer 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',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    base_tree: currentSha,
                    tree: [
                        {
                            path: 'it.txt',
                            mode: '100644',
                            type: 'blob',
                            sha: newSha,
                        },
                    ],
                }),
            })
            .then(response => response.json())
            .then(treeData => {
                const newTreeSha = treeData.sha;

                // 使用 GitHub API 创建一个新的提交对象
                fetch('https://api.github.com/repos/cgi2024/it/git/commits', {
                    method: 'POST',
                    headers: {
                        'Authorization': 'Bearer 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',
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        message: 'Update content from website',
                        parents: [currentSha],
                        tree: newTreeSha,
                    }),
                })
                .then(response => response.json())
                .then(commitData => {
                    const newCommitSha = commitData.sha;

                    // 使用 GitHub API 更新分支引用
                    fetch('https://api.github.com/repos/cgi2024/it/git/refs/heads/main', {
                        method: 'PATCH',
                        headers: {
                            'Authorization': 'Bearer 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',
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            sha: newCommitSha,
                        }),
                    })
                    .then(response => response.json())
                    .then(data => console.log(data))
                    .catch(error => console.error(error));
                })
                .catch(error => console.error(error));
            })
            .catch(error => console.error(error));
        })
        .catch(error => console.error(error));
    })
    .catch(error => console.error(error));
}
