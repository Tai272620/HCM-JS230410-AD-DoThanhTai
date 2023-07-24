import express from 'express';
const router = express.Router();
import fs from 'fs';
import path from 'path';

router.get('/', (req, res) => {
    fs.readFile(path.join(__dirname, "posts.json"), 'utf-8', (err, data) => {
        if (err) {
            return res.status(500).json({
                message: "Lay posts that bai!"
            })
        }
        if (req.query.id) {
            let post = JSON.parse(data).find(post => post.id == req.query.id);
            if (post) {
                return res.status(200).json(
                    {
                        data: post
                    }
                )
            }
            else {
                return res.status(500).json({
                    message: `Không tìm được post có ID ${req.query.id}`
                })
            }
        }
        return res.status(200).json({
            message: "Lay users thanh cong",
            data: JSON.parse(data)
        })
    })
})

router.post('/', (req, res) => {

    fs.readFile(path.join(__dirname, "posts.json"), 'utf-8', (err, data) => {
        if (err) {
            return res.status(500).json(
                {
                    message: "Đọc dữ liệu thất bại!"
                }
            )
        }

        let oldData = JSON.parse(data);

        let newPost = {
            id: Date.now(),
            ...req.body
        }

        oldData.push(newPost)

        fs.writeFile(path.join(__dirname, "posts.json"), JSON.stringify(oldData), (err) => {
            if (err) {
                return res.status(500).json(
                    {
                        message: "Ghi file thất bại!"
                    }
                )
            }
            res.status(200).json({
                message: "Add post success!",
                data: newPost
            })
        })
    })

})

router.delete('/:id', (req, res) => {
    if (req.params.id) {
        fs.readFile(path.join(__dirname, "posts.json"), 'utf-8', (err, data) => {
            if (err) {
                return res.status(500).json({
                    message: "Lấy posts thất bại!"
                })
            }
            let posts = JSON.parse(data);
            posts = posts.filter(post => post.id != req.params.id);

            fs.writeFile(path.join(__dirname, "posts.json"), JSON.stringify(posts), (err) => {
                if (err) {
                    return res.status(500).json({
                        message: "Lưu file thất bại!"
                    })
                }
                return res.status(200).json(
                    {
                        message: "Xoa post thanh cong"
                    }
                )
            })
        })
    } else {
        return res.status(500).json(
            {
                message: "Vui lòng truyền idPost!"
            }
        )
    }
})

router.patch('/:id', (req, res) => {
    if (req.params.id) {
        let flag = false;
        fs.readFile(path.join(__dirname, "posts.json"), 'utf-8', (err, data) => {
            if (err) {
                return res.status(500).json({
                    message: "Lấy posts thất bại!"
                })
            }
            let posts = JSON.parse(data);

            posts = posts.map(post => {
                if (post.id == req.params.id) {
                    flag = true;
                    return {
                        ...post,
                        ...req.body
                    }
                }
                return post
            })

            fs.writeFile(path.join(__dirname, "posts.json"), JSON.stringify(posts), (err) => {
                if (err) {
                    return res.status(500).json({
                        message: "Lưu file thất bại!"
                    })
                }
                return res.status(200).json(
                    {
                        message: "Patch post thanh cong"
                    }
                )
            })
        })
    }
})


module.exports = router;