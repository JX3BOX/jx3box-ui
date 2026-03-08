import $ from "jquery";
import { showAvatar } from "@jx3box/jx3box-common/js/utils";

/**
 * 渲染音频组件
 * 将 e-audio 转换为实际的音频播放器
 * @param {string} selector - 选择器，默认为 ".w-audio, .e-audio"
 */
function renderVoice(selector = ".w-audio, .e-audio") {
    try {
        $(selector).each(function (i, ele) {
            const $audio = $(this);
            const content = $audio.text().trim();

            // 解析内容：name:xxx;author:xxx;user_id:xxx;src:xxx
            const params = {};
            content.split(";").forEach((item) => {
                const [key, value] = item.split("|");
                if (key && value !== undefined) {
                    params[key.trim()] = value.trim();
                }
            });

            // 提取参数
            const { name = "未命名音频", author = "未知", user_id = "", src = "" } = params;

            if (!src) {
                console.warn("音频源地址为空", content);
                return;
            }

            // 生成唯一ID
            const playerId = `audio-player-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

            // 获取用户头像，如果没有则使用默认图片
            const avatar = showAvatar(params.avatar, 240);

            // 渲染音频播放器 - 使用项目中定义的样式结构
            const html = `
                <div class="w-audio-player" id="${playerId}" data-user-id="${user_id}">
                    <div class="m-item">
                        <div class="u-title">
                            <div class="clip">
                                <div class="marquee-wrapper">
                                    <span class="marquee-text">${name}</span>
                                </div>
                            </div>
                        </div>
                        <div class="u-author">
                            练习生：<a href="https://www.jx3box.com/author/${user_id}" target="_blank">${author}</a>
                        </div>
                        
                        <div class="m-record">
                            <img class="u-needle" src="https://cdn.jx3box.com/design/event/jx3cxk/web/item/needle.svg" />
                            <a href="https://www.jx3box.com/author/${user_id}" target="_blank" class="u-record">
                                <img class="u-avatar" src="${avatar}" />
                            </a>
                        </div>

                        <div class="m-progress">
                            <div class="u-progress-bar">
                                <div class="u-progress-fill"></div>
                                <div class="u-progress-handle"></div>
                            </div>
                        </div>

                        <div class="m-play">
                            <div class="u-play-button">
                                <img class="u-icon" src="https://cdn.jx3box.com/design/event/jx3cxk/web/item/left.svg" />
                                <img class="u-icon u-play" src="https://cdn.jx3box.com/design/event/jx3cxk/web/item/play.svg" data-play-icon="https://cdn.jx3box.com/design/event/jx3cxk/web/item/play.svg" data-stop-icon="https://cdn.jx3box.com/design/event/jx3cxk/web/item/stop.svg" />
                                <img class="u-icon" src="https://cdn.jx3box.com/design/event/jx3cxk/web/item/right.svg" />
                            </div>
                        </div>
                    </div>
                    <audio preload="metadata" src="${src}"></audio>
                </div>
            `;

            $audio.replaceWith(html);

            // 初始化播放器功能
            initAudioPlayer(playerId);
        });
    } catch (e) {
        console.error("音频渲染错误:", e);
    }
}

/**
 * 初始化音频播放器功能
 * @param {string} playerId - 播放器ID
 */
function initAudioPlayer(playerId) {
    const $player = $(`#${playerId}`);
    const audio = $player.find("audio")[0];
    const $playBtn = $player.find(".u-play");
    const $needle = $player.find(".u-needle");
    const $avatar = $player.find(".u-avatar");
    const $progressBar = $player.find(".u-progress-bar");
    const $progressFill = $player.find(".u-progress-fill");
    const $progressHandle = $player.find(".u-progress-handle");

    if (!audio) {
        console.warn("音频元素未找到", playerId);
        return;
    }

    let isPlaying = false;
    let isDragging = false;

    // 播放/暂停切换
    $playBtn.on("click", function () {
        const playIcon = $(this).data("play-icon");
        const stopIcon = $(this).data("stop-icon");

        if (isPlaying) {
            audio.pause();
            $(this).attr("src", playIcon);
            $needle.removeClass("isPlaying");
            $avatar.addClass("isPaused");
            $player.removeClass("play");
        } else {
            audio.play();
            $(this).attr("src", stopIcon);
            $needle.addClass("isPlaying");
            $avatar.removeClass("isPaused").addClass("isRotate");
            $player.addClass("play");
        }
        isPlaying = !isPlaying;
    });

    // 音频播放状态改变
    audio.addEventListener("play", function () {
        isPlaying = true;
        $playBtn.attr("src", $playBtn.data("stop-icon"));
        $needle.addClass("isPlaying");
        $avatar.removeClass("isPaused").addClass("isRotate");
        $player.addClass("play");
    });

    audio.addEventListener("pause", function () {
        isPlaying = false;
        $playBtn.attr("src", $playBtn.data("play-icon"));
        $needle.removeClass("isPlaying");
        $avatar.addClass("isPaused");
        $player.removeClass("play");
    });

    // 更新进度条
    audio.addEventListener("timeupdate", function () {
        if (!isDragging && audio.duration) {
            const progress = (audio.currentTime / audio.duration) * 100;
            $progressFill.css("width", progress + "%");
            $progressHandle.css("left", progress + "%");
        }
    });

    // 进度条拖拽和点击
    function updateProgress(e) {
        const rect = $progressBar[0].getBoundingClientRect();
        const offsetX = e.clientX - rect.left;
        const progress = Math.max(0, Math.min(1, offsetX / rect.width));
        const newTime = progress * audio.duration;

        $progressFill.css("width", progress * 100 + "%");
        $progressHandle.css("left", progress * 100 + "%");

        if (isDragging || e.type === "click") {
            audio.currentTime = newTime;
        }
    }

    $progressBar.on("mousedown", function (e) {
        isDragging = true;
        updateProgress(e);
    });

    $(document).on("mousemove", function (e) {
        if (isDragging) {
            updateProgress(e);
        }
    });

    $(document).on("mouseup", function (e) {
        if (isDragging) {
            updateProgress(e);
            isDragging = false;
        }
    });

    $progressBar.on("click", function (e) {
        updateProgress(e);
    });

    // 音频结束
    audio.addEventListener("ended", function () {
        isPlaying = false;
        audio.currentTime = 0;
        $playBtn.attr("src", $playBtn.data("play-icon"));
        $needle.removeClass("isPlaying");
        $avatar.removeClass("isRotate isPaused");
        $player.removeClass("play");
        $progressFill.css("width", "0%");
        $progressHandle.css("left", "0%");
    });

    // 检查标题是否需要滚动
    checkTextWidth($player);
}

/**
 * 检查文本宽度，决定是否需要滚动动画
 * @param {jQuery} $player - 播放器元素
 */
function checkTextWidth($player) {
    const $wrapper = $player.find(".marquee-wrapper");
    const $text = $player.find(".marquee-text");

    if (!$text.length || !$wrapper.length) return;

    const textWidth = $text[0].offsetWidth;
    const containerWidth = $wrapper.parent()[0].clientWidth;

    if (textWidth > containerWidth) {
        $wrapper.addClass("marquee-active");
        // 添加复制的文本用于无缝滚动
        const copyText = $text.clone().addClass("copy");
        $wrapper.append(copyText);

        // 计算动画时长
        const totalWidth = textWidth * 2 + 180; // 180px 是间距
        const duration = totalWidth / 30; // 30px/s
        $wrapper.css("animation-duration", `${duration}s`);
        $wrapper.addClass("marquee-animate");
    }
}

export default renderVoice;
