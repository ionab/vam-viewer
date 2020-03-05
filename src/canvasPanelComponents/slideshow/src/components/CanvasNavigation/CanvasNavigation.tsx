import React, { useEffect } from 'react';
// @ts-ignore
import { withBemClass } from '@canvas-panel/core';
import withLocation from '../withLocation/withLocation';
import queryString from 'query-string';

import './CanvasNavigation.scss';

interface CanvasNavigationProps {
  previousRange: () => void;
  nextRange: () => void;
  canvasList: Array<Object>;
  currentIndex: number;
  goToRange: (arg0: number) => void;
  bem: string | Object;
  hash: any;
  size: number;
  addressable: boolean;
  id: string | number;
}

const CanvasNavigation: React.FC<CanvasNavigationProps> = ({
  previousRange,
  nextRange,
  canvasList,
  currentIndex,
  goToRange,
  bem,
  hash,
  addressable = false,
  // @ts-ignore
  size = canvasList ? canvasList.length : size,
  id,
}) => {
  const goToSlide = (index: number | string) => {
    index = index + '';
    if (addressable) {
      const qParam = queryString.parse(window.location.hash);
      if (
        qParam.id &&
        Array.isArray(qParam.id) &&
        qParam.slide &&
        Array.isArray(qParam.slide)
      ) {
        const indexOfQueryId = qParam.id.find(query => parseInt(query) === id);
        if (indexOfQueryId) {
          qParam.slide[parseInt(indexOfQueryId)] = currentIndex + '';
          document.location.hash = queryString.stringify(qParam);
        }
      } else {
        if (typeof qParam.id === 'string' && parseInt(qParam.id) !== id) {
          document.location.hash =
            document.location.hash + `&${buildId(currentIndex)}`;
        } else {
          document.location.hash = `#${buildId(currentIndex)}`;
        }
      }
    }
  };

  const buildId = (index: number | string) => {
    return `id=${id}&slide=${index}`;
  };

  const getSlideByID = () => {
    const qParam = queryString.parse(window.location.hash);
    let slide: any;
    if (
      qParam.id &&
      Array.isArray(qParam.id) &&
      qParam.slide &&
      Array.isArray(qParam.slide)
    ) {
      const indexOfQueryId = qParam.id.find(
        (query: string) => parseInt(query) === id
      );
      if (indexOfQueryId) slide = qParam.slide[parseInt(indexOfQueryId)];
      if (!slide || slide < 0 || slide >= canvasList.length) slide = '0';
    } else {
      slide = qParam.slide;
    }
    if (!slide) slide = '0';
    return parseInt(slide);
  };

  useEffect(() => {
    if (addressable && hash) {
      if (typeof hash.slide === 'string') {
        let slideId = hash.slide;
        if (slideId) {
          parseInt(slideId);
        }
        let intSlideId = slideId ? parseInt(slideId) : 0;
        if (
          !hash ||
          !intSlideId ||
          intSlideId < 0 ||
          intSlideId >= canvasList.length
        ) {
          goToSlide(currentIndex);
          return;
        } else {
          goToRange(intSlideId);
        }
      } else {
        goToRange(getSlideByID());
      }
    }
  }, []);

  useEffect(() => {
    goToSlide(getSlideByID());
  }, [currentIndex]);

  return (
    // @ts-ignore
    <div className={bem}>
      <button
        className={bem
          // @ts-ignore
          .element('previous')
          .modifiers({ isFirstPage: currentIndex === 0 })}
        onClick={ev => {
          ev.preventDefault();
          previousRange();
        }}
      >
        <svg viewBox="0 0 100 100" width="20px" height="20px">
          <path fill="none" d="M-1-1h582v402H-1z" />
          <g>
            <path
              d="M70.173 12.294L57.446.174l-47.62 50 47.62 50 12.727-12.122-36.075-37.879z"
              fill="currentColor"
              fillRule="nonzero"
            />
          </g>
        </svg>
      </button>
      <button
        className={bem
          // @ts-ignore
          .element('next')
          .modifiers({ isLastPage: currentIndex === size - 1 })}
        onClick={ev => {
          ev.preventDefault();
          nextRange();
        }}
      >
        <svg viewBox="0 0 100 100" width="20px" height="20px">
          <path fill="none" d="M-1-1h582v402H-1z" />
          <g>
            <path
              d="M20 88.052l12.727 12.121 47.62-50-47.62-50L20 12.294l36.075 37.88z"
              fill="currentColor"
              fillRule="nonzero"
            />
          </g>
        </svg>
      </button>
    </div>
  );
};

const navigation = withBemClass('canvas-navigation')(CanvasNavigation);

export default withLocation(navigation);