import React from 'react';
import { useTranslation } from 'next-i18next';

const ClassificationList = ({ classifications, isRTL, onSelect, selectedId }) => {
  const { t } = useTranslation('common');
  console.log(selectedId, '----selectedId')

  return (
     <div className="col-lg-12" style={{padding:'0'}}>
      <div className="rounded-box">
        <h6 id="Classification">{t('classification')}</h6>
      </div>
      <div className="ClassificationScroll">
        <ul id="NCSITheme" className="list-group">
          <li
            key="all"
            data-key=""
            className={`publ-group-item indicators-desc ${!selectedId ? 'selected' : ''}`}
            style={{ paddingTop: '14px', cursor: 'pointer' }}
            onClick={() => onSelect('')}
          >
            {t('all')} 
          </li>
          {classifications?.map(({ id, name, name_ar }) => (
            <li
              key={id}
              data-key={id}
              className={`publ-group-item indicators-desc ${selectedId == id ? 'selected' : ''}`}
              style={{ paddingTop: '14px', cursor: 'pointer' }}
              onClick={() => onSelect(id)}
            >
              {isRTL ? name_ar : name}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ClassificationList;
