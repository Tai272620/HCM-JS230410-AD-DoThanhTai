import express from 'express';
const router = express.Router();
import fs from 'fs';
import path from 'path';

router.get('/:id/posts', (req, res) => {
    if (req.params.id) {
        fs.readFile(path.join(__dirname, "users.json"), 'utf-8', (err, data) => {
            if (err) {
                return res.status(500).json({
                    message: "Lấy users thất bại!"
                });
            }

            const users = JSON.parse(data);
            const user = users.find(user => user.id == req.params.id);

            if (!user) {
                return res.status(500).json({
                    message: `Không tìm được người có ID ${req.params.id}`
                });
            }

            fs.readFile(path.join(__dirname, "posts.json"), 'utf-8', (err, postData) => {
                if (err) {
                    return res.status(500).json({
                        message: "Lấy posts thất bại!"
                    });
                }

                const posts = JSON.parse(postData);
                const userPosts = posts.filter(post => post.userId == req.params.id);

                return res.status(200).json({
                    message: "Lấy posts thành công!",
                    data: userPosts
                });
            });
        });
    } else {
        return res.status(500).json({
            message: "Vui lòng truyền idUser!"
        });
    }
});

router.get('/', (req, res) => {
    fs.readFile(path.join(__dirname, "users.json"), 'utf-8', (err, data) => {
        if (err) {
            return res.status(500).json({
                message: "Lay users that bai!"
            })
        }
        if (req.query.id) {
            let user = JSON.parse(data).find(user => user.id == req.query.id);
            if (user) {
                return res.status(200).json(
                    {
                        data: user
                    }
                )
            }
            else {
                return res.status(500).json({
                    message: `Không tìm được người có ID ${req.query.id}`
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

    fs.readFile(path.join(__dirname, "users.json"), 'utf-8', (err, data) => {
        if (err) {
            return res.status(500).json(
                {
                    message: "Đọc dữ liệu thất bại!"
                }
            )
        }

        let oldData = JSON.parse(data);

        let newUser = {
            id: Date.now(),
            ...req.body
        }

        oldData.push(newUser)

        fs.writeFile(path.join(__dirname, "users.json"), JSON.stringify(oldData), (err) => {
            if (err) {
                return res.status(500).json(
                    {
                        message: "Ghi file thất bại!"
                    }
                )
            }
            res.status(200).json({
                message: "Add user success!",
                data: newUser
            })
        })
    })

})

router.delete('/:id', (req, res) => {
    if (req.params.id) {
        fs.readFile(path.join(__dirname, "users.json"), 'utf-8', (err, data) => {
            if (err) {
                return res.status(500).json({
                    message: "Lấy users thất bại!"
                })
            }
            let users = JSON.parse(data);
            users = users.filter(user => user.id != req.params.id);

            fs.writeFile(path.join(__dirname, "users.json"), JSON.stringify(users), (err) => {
                if (err) {
                    return res.status(500).json({
                        message: "Lưu file thất bại!"
                    })
                }
                return res.status(200).json(
                    {
                        message: "Xoa user thanh cong",
                    }
                )
            })
        })
    } else {
        return res.status(500).json(
            {
                message: "Vui lòng truyền idUser!"
            }
        )
    }
})

router.patch('/:id', (req, res) => {
    // console.log(req.body)
    if (req.params.id) {
        let flag = false;
        fs.readFile(path.join(__dirname, "users.json"), 'utf-8', (err, data) => {
            if (err) {
                return res.status(500).json({
                    message: "Lấy users thất bại!"
                })
            }
            let users = JSON.parse(data);

            users = users.map(user => {
                if (user.id == req.params.id) {
                    flag = true;
                    return {
                        ...user,
                        ...req.body
                    }
                }
                return user
            })

            fs.writeFile(path.join(__dirname, "users.json"), JSON.stringify(users), (err) => {
                if (err) {
                    return res.status(500).json({
                        message: "Lưu file thất bại!"
                    })
                }
                return res.status(200).json(
                    {
                        message: "Patch user thanh cong"
                    }
                )
            })
        })
    }
})

module.exports = router;