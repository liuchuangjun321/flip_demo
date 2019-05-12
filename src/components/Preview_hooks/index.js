import React, {useState, useEffect} from 'react';

// 标识预览的状态，1：显示，2：开始关闭，3：已关闭
let previewVisibleStatus = 3;
// 记录动画起始状态的元素位置信息，left, top
const previewFirstRect = [0, 0];
const previewLastRect = [0, 0];
// 临时记录位置信息
let rectInfo = null;
// First与Last两个状态之间的缩放比例
let scaleValue = 1;
// 生成初始测试数据
let listData = Array(10).fill().map(() => {
  const width = getSize();
  const height = getSize();
  return {
    width,
    height,
    bgPic: `https://dummyimage.com/${width}x${height}/${color16()}`
  }
})

// 获取在 200-900之间的随机整数
function getSize () {
  return Math.round(Math.random() * 700 + 200)
}
// 生成随机 16进制颜色
function color16() {
  return ('00000' + (Math.random() * 0x1000000 << 0).toString(16)).substr(-6)
}

function Preview () {
  var previewRef = React.createRef();
  const [previewStatus, setPreviewStatus] = useState(0);
  const [previewImgInfo, setPreviewImgInfo] = useState(null);

  useEffect(() => {
    updatePreviewStatus();
  })

  var updatePreviewStatus = () => {
    if (previewStatus === 1) {
      // 计算终态
      if (previewVisibleStatus === 1) {
        const lastRectInfo = previewRef.current.getBoundingClientRect();
        previewLastRect[0] = lastRectInfo.left;
        previewLastRect[1] = lastRectInfo.top;
        scaleValue = rectInfo.width / lastRectInfo.width;
      }
      setPreviewStatus(2);
    } else if (previewStatus === 2) {
      // Play,会有animation动画效果
      setTimeout(() => {
        setPreviewStatus(3);
      }, 10);
    }
  }

  var previewItem = (status, previewImgInfo = null, e) => {
    previewVisibleStatus = status;
    if (previewVisibleStatus === 1) {
      // 计算初始态
      const currentPreviewEle = e.target;
      rectInfo = currentPreviewEle.getBoundingClientRect();
      previewFirstRect[0] = rectInfo.left;
      previewFirstRect[1] = rectInfo.top;
      setPreviewStatus(1);
      setPreviewImgInfo(previewImgInfo);
      console.log('previewImgInfo=', previewImgInfo);
    } else {
      setPreviewStatus(1);
    }
  }

  var transEnd = (e) => {
    if (previewVisibleStatus === 2 && previewVisibleStatus !== 3) {
      previewVisibleStatus = 3;
      setPreviewStatus(0);
    }
  }

  return (
    <>
      <ul className="pic-list">
        {
          listData.map((item, index) => (
            <li
              key={index}
              className="pic-item"
              onClick={(target) => {previewItem(1, item, target)}}
              title="点击预览">
              <img src={item.bgPic} alt="" className="pic" />
            </li>
          ))
        }
      </ul>
      {
        (previewVisibleStatus === 1 || previewVisibleStatus === 2) ? (
          <>
            <div
              className="preview-box"
              onClick={(target) => {previewItem(2, null, target)}}
              style={{
                opacity: previewStatus === 3 && previewVisibleStatus !== 2 ? .65 : 0
              }}
            ></div>
            <img
              ref={previewRef}
              className={`img${(previewStatus === 3 && previewVisibleStatus === 1) || previewVisibleStatus === 2 ? ' active' : ''}`}
              src={previewImgInfo.bgPic}
              style={{
                // 缩放
                transform: previewStatus === 2 || previewVisibleStatus === 2
                  ? `translate3d(${previewFirstRect[0] - previewLastRect[0]}px, ${previewFirstRect[1] - previewLastRect[1]}px, 0) scale(${scaleValue})`
                  : 'translate3d(0, 0, 0) scale(1)',
                transformOrigin: '0 0',
                opacity: previewStatus === 2 || previewVisibleStatus === 2 ? 0 : 1
              }}
              onClick={(target) => {previewItem(2, null, target)}}
              onTransitionEnd={transEnd()}
              alt="" />
          </>
        ) : null
      }
    </>
  );
}

export default Preview;
