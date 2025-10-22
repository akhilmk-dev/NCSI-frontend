import Cookies from 'js-cookie';
import Link from 'next/link';
import { useRouter } from 'next/router';

function Custom404() {
    const router = useRouter();
    const isRTL = router.locale == "ar";
    const localePath = router.locale === 'ar' ? '/ar' : '/';
    const textAlignStyle = { textAlign: isRTL ? 'right' : 'left' };
    return (
        <div id="ms-error-body">
            <div id="ms-error" >
                <div id="ms-error-top" ></div>

                <div id="ms-error-content" >
                    <div id="ms-error-error-content" style={textAlignStyle}>
                        <div id="DeltaPlaceHolderMain">
                            <span className="TitleError" >404</span>
                            <span>
                                {isRTL ? "الصفحة التي كنت تبحث عنها يبدو أنه تم نقلها أو حذفها أو أنها غير موجودة. يمكنك" : "The page you were looking for appears to have been moved, deleted or does not exist. You could"}
                                <Link href={localePath} style={{ display: "inline", color: "#cc9900", textDecoration: "underline", direction: isRTL ? 'rtl' : 'ltr', whiteSpace: 'nowrap', padding: '0 10px' }}>
                                    <span >
                                        {isRTL ? " العودة إلى الموقع" : " Go back to site"}
                                    </span>
                            </Link>
                            </span>
                            
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

Custom404.noLayout = true;

export default Custom404;
