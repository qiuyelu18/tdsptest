document.addEventListener('DOMContentLoaded', function() {
    // 显示下载提示弹窗
    const downloadModal = document.getElementById('download-modal');
    const closeModal = document.querySelector('.close-modal');
    const confirmModal = document.getElementById('confirm-modal');
    
    // 检查是否在6分钟内已经显示过弹窗
    const lastModalTime = localStorage.getItem('lastModalTime');
    const currentTime = new Date().getTime();
    const sixMinutesInMs = 6 * 60 * 1000; // 6分钟转换为毫秒
    
    // 如果之前没有显示过，或者已经过了6分钟
    if (!lastModalTime || (currentTime - parseInt(lastModalTime)) > sixMinutesInMs) {
        // 延迟显示弹窗，让用户先看到页面
        setTimeout(() => {
            downloadModal.classList.add('show');
            // 记录当前时间
            localStorage.setItem('lastModalTime', currentTime.toString());
        }, 800);
    }
    
    // 关闭弹窗
    function closeDownloadModal() {
        downloadModal.classList.remove('show');
    }
    
    closeModal.addEventListener('click', closeDownloadModal);
    confirmModal.addEventListener('click', closeDownloadModal);
    
    // 点击弹窗外部区域也可以关闭
    downloadModal.addEventListener('click', function(e) {
        if (e.target === downloadModal) {
            closeDownloadModal();
        }
    });
    
    // 处理教程选择和显示
    const guideIconLinks = document.querySelectorAll('.guide-icon-link');
    const platformCards = document.querySelectorAll('.platform-card');
    
    // 选择平台提示动画
    const selectionTip = document.querySelector('.platform-selection-tip p');
    if (selectionTip) {
        // 添加短暂闪光效果引起注意
        setTimeout(() => {
            selectionTip.style.backgroundColor = 'rgba(106, 90, 205, 0.3)';
            setTimeout(() => {
                selectionTip.style.backgroundColor = 'rgba(106, 90, 205, 0.1)';
            }, 700);
        }, 1000);
    }
    
    guideIconLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // 获取目标平台ID
            const targetId = this.getAttribute('data-target');
            
            // 隐藏所有平台卡片
            platformCards.forEach(card => {
                card.style.display = 'none';
                card.classList.remove('active-card');
            });
            
            // 移除所有图标的激活状态
            guideIconLinks.forEach(iconLink => {
                iconLink.querySelector('.guide-icon').classList.remove('active-guide');
            });
            
            // 显示目标平台卡片
            const targetCard = document.getElementById(targetId);
            if (targetCard) {
                // 先显示卡片
                targetCard.style.display = 'block';
                
                // 获取卡片标题(h2)的位置，它紧接着紫色线条
                const cardTitle = targetCard.querySelector('h2');
                
                // 添加动画效果
                setTimeout(() => {
                    targetCard.classList.add('active-card');
                    
                    // 使用卡片顶部位置加上固定偏移量
                    const cardTop = targetCard.getBoundingClientRect().top;
                    const headerHeight = 180; // 估计头部高度，可以根据实际情况调整
                    
                    // 计算滚动位置：当前滚动位置 + 卡片相对视口位置 - 固定偏移
                    // 这样可以确保卡片上方显示一定的空间，紫色线条会更明显
                    const scrollPosition = window.pageYOffset + cardTop - headerHeight;
                    
                    // 平滑滚动
                    window.scrollTo({
                        top: scrollPosition,
                        behavior: 'smooth'
                    });
                }, 10);
                
                // 为当前选中的图标添加激活状态
                this.querySelector('.guide-icon').classList.add('active-guide');
            }
        });
    });
    
    // 平滑滚动效果
    document.querySelectorAll('a[href^="#"]:not(.guide-icon-link)').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });
    
    // 给FAQ项添加点击展开/收起功能
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('h3');
        const answer = item.querySelector('p');
        
        // 初始设置，默认隐藏答案
        answer.style.display = 'block';
        answer.style.maxHeight = '0';
        
        question.addEventListener('click', () => {
            const isActive = item.classList.contains('active');
            
            // 关闭所有其他活动项
            faqItems.forEach(otherItem => {
                if (otherItem !== item && otherItem.classList.contains('active')) {
                    otherItem.classList.remove('active');
                    otherItem.querySelector('p').style.maxHeight = '0';
                }
            });
            
            // 切换活动状态
            if (isActive) {
                answer.style.maxHeight = '0';
                item.classList.remove('active');
            } else {
                item.classList.add('active');
                answer.style.maxHeight = answer.scrollHeight + 'px';
            }
        });
    });
    
    // 默认激活第一个FAQ项
    if (faqItems.length > 0) {
        const firstItem = faqItems[0];
        const firstAnswer = firstItem.querySelector('p');
        
        firstItem.classList.add('active');
        firstAnswer.style.maxHeight = firstAnswer.scrollHeight + 'px';
    }
    
    // 添加卡片悬停效果
    const cards = document.querySelectorAll('.platform-card');
    
    cards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            if (!card.classList.contains('active-card')) return;
            card.style.transform = 'translateY(-10px)';
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0)';
        });
    });
    
    // 回到顶部按钮
    const backToTopBtn = document.getElementById('backToTop');
    
    // 回到顶部功能
    backToTopBtn.addEventListener('click', function(e) {
        e.preventDefault();
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
    
    // 滚动时显示/隐藏回到顶部按钮
    window.addEventListener('scroll', function() {
        if (window.pageYOffset > 300) {
            backToTopBtn.classList.add('visible');
        } else {
            backToTopBtn.classList.remove('visible');
        }
    });
    
    // 检测设备类型，对移动设备进行优化
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    
    if (isMobile) {
        // 移动设备上优化点击区域
        const clickableElements = document.querySelectorAll('.guide-icon, .download-button, .video-link, .faq-item h3');
        
        clickableElements.forEach(element => {
            element.style.padding = element.style.padding || getComputedStyle(element).padding;
            
            // 增加点击区域的内边距，但不影响布局
            if (element.classList.contains('download-button')) {
                element.style.padding = '15px 30px';
            } else if (element.tagName === 'H3') {
                element.style.padding = '10px 0';
            }
        });
    }
    
    // 添加触摸反馈效果
    const touchElements = document.querySelectorAll('.guide-icon, .download-button, .video-link, .faq-item, .back-to-top, .social-links a');
    
    touchElements.forEach(element => {
        element.addEventListener('touchstart', function() {
            this.classList.add('touch-active');
        }, { passive: true });
        
        element.addEventListener('touchend', function() {
            this.classList.remove('touch-active');
        }, { passive: true });
    });
    
    // 为常见设备问题提供更具体的帮助
    if (isMobile) {
        const deviceInfo = {
            model: navigator.userAgent,
            os: navigator.platform || 'unknown'
        };
        
        if (/iPhone|iPad|iPod/.test(deviceInfo.model)) {
            // iOS设备需要特殊处理
            const faqItems = document.querySelectorAll('.faq-item');
            let iosInfoAdded = false;
            
            faqItems.forEach(item => {
                const question = item.querySelector('h3').textContent;
                if (question.includes('未知来源') && !iosInfoAdded) {
                    const answer = item.querySelector('p');
                    answer.innerHTML += '<br><br><strong>iOS用户注意:</strong> iOS系统不允许直接安装第三方应用。请通过官方应用商店下载Potato Chat。';
                    iosInfoAdded = true;
                }
            });
        }
    }

    // 处理视频加载错误
    const androidVideo = document.getElementById('android-tutorial-video');
    
    if (androidVideo) {
        androidVideo.addEventListener('error', function() {
            const videoContainer = this.closest('.video-container');
            if (videoContainer) {
                const errorMsg = document.createElement('p');
                errorMsg.className = 'video-unavailable';
                errorMsg.textContent = '视频加载失败，请稍后再试';
                
                // 替换视频元素
                this.style.display = 'none';
                videoContainer.appendChild(errorMsg);
            }
        });
        
        // 添加视频加载成功的处理
        androidVideo.addEventListener('loadeddata', function() {
            console.log('Android教程视频加载成功');
        });
    }

    // 处理下载按钮点击事件
    const downloadButtons = document.querySelectorAll('.download-button');
    
    downloadButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const downloadLink = this.getAttribute('data-link');
            
            // 显示小提示，然后跳转
            const platformText = this.textContent.includes('Android') ? 'Android' : 'Windows';
            
            const confirmDownload = confirm(`您即将被跳转至夸克网盘下载 ${platformText} 版 Potato Chat。\n\n在夸克网盘页面，请点击"下载"按钮继续。`);
            
            if (confirmDownload) {
                window.open(downloadLink, '_blank');
            }
        });
    });
}); 