const video = document.getElementById('video');
const capturedImage = document.getElementById('capturedImage');
const openButton = document.getElementById('openButton');
const captureButton = document.getElementById('captureButton');
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

// Hàm chụp ảnh
function captureImage() {
    // Tạo canvas để vẽ frame từ video
    canvas.width = video.videoWidth + capturedImage.width;
    canvas.height = Math.max(video.videoHeight, capturedImage.height);
    ctx.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);
    ctx.drawImage(capturedImage, video.videoWidth, 0, capturedImage.width, capturedImage.height);

    // Ẩn phần hiển thị video của webcam
    video.style.display = 'none';

    // Lấy dữ liệu ảnh từ canvas và gán vào src của profile
    const imageData = canvas.toDataURL().split(',')[1]; // Lấy phần sau dấu phẩy
    document.querySelector('.profile').src = 'data:image/png;base64,' + imageData;

    // Gọi hàm để gửi dữ liệu ảnh đến API
    captureImageAndSendToAPI(imageData);
}


// Lấy quyền truy cập vào webcam
async function getMedia() {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        video.srcObject = stream;
        video.style.display = 'block';
        captureButton.style.display = 'block';
        openButton.style.display = 'none';
    } catch (err) {
        console.error('Không thể truy cập webcam:', err);
    }
}

// Gửi dữ liệu ảnh đến API
async function captureImageAndSendToAPI(imageData) {
    try {
        // Hiển thị biểu tượng tải
        const loadingIcon = document.createElement('i');
        loadingIcon.classList.add('fa', 'fa-spinner', 'fa-spin', 'loading-icon');
        document.querySelector('.content__button').appendChild(loadingIcon);

        // Gửi dữ liệu ảnh dưới dạng base64 tới API
        const response = await fetch('https://vietdata-predict-age.hf.space/complete', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ image: imageData })
        });

        // Xóa biểu tượng tải sau khi nhận phản hồi từ API
        loadingIcon.remove();

        // Xử lý kết quả từ API
        const data = await response.json();

        // Cập nhật nội dung HTML với dữ liệu từ API
        const friendsElement = document.querySelector('.content__list li:first-child span');
        // Kiểm tra xem phần tử HTML có tồn tại không trước khi cập nhật
        if (friendsElement) {
            friendsElement.textContent = data
        } else {
            console.error('Không tìm thấy phần tử HTML để cập nhật.');
        }
    } catch (error) {
        console.error('Lỗi khi gửi yêu cầu tới API:', error);
    }
}
// Gửi dữ liệu ảnh đến API
async function captureImageAndSendToAPI(imageData) {
    try {
        // Hiển thị biểu tượng tải
        const loadingIcon = document.createElement('i');
        loadingIcon.classList.add('fa', 'fa-spinner', 'fa-spin', 'loading-icon');
        document.querySelector('.content__button').appendChild(loadingIcon);

        // Gửi dữ liệu ảnh dưới dạng base64 tới API
        const response = await fetch('https://vietdata-predict-age.hf.space/complete', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ image: imageData })
        });

        // Xóa biểu tượng tải sau khi nhận phản hồi từ API
        loadingIcon.remove();

        // Xử lý kết quả từ API
        const data = await response.json();

        // Cập nhật nội dung HTML với dữ liệu từ API
        const friendsElement = document.querySelector('.content__list li:first-child span');
        // Kiểm tra xem phần tử HTML có tồn tại không trước khi cập nhật
        if (friendsElement) {
            friendsElement.textContent = data
        } else {
            console.error('Không tìm thấy phần tử HTML để cập nhật.');
        }
    } catch (error) {
        console.error('Lỗi khi gửi yêu cầu tới API:', error);
    }
}


// Thêm sự kiện click để chụp và gửi ảnh đến API
captureButton.addEventListener('click', captureImage);

// Gọi hàm để lấy quyền truy cập vào webcam khi người dùng nhấn nút "Mở Webcam"
openButton.addEventListener('click', getMedia);
