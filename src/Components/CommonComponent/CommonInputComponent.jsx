
// import React, { useState } from 'react';
// import {
//     View,
//     Text,
//     TextInput,
//     TouchableOpacity,
//     StyleSheet,
//     ScrollView,
// } from 'react-native';

// const statusColors = {
//     default: {
//         border: '#E1E4EA',
//         background: '#FFFFFF',
//         text: '#202638',
//         helper: '#9CA3AF',
//     },
//     filled: {
//         border: '#E1E4EA',
//         background: '#F8F9FB',
//         text: '#202638',
//         helper: '#9CA3AF',
//     },
//     success: {
//         border: '#22C55E',
//         background: '#ECFDF3',
//         text: '#202638',
//         helper: '#22C55E',
//     },
//     info: {
//         border: '#0099FF',
//         background: '#EAF6FF',
//         text: '#202638',
//         helper: '#0099FF',
//     },
//     warning: {
//         border: '#FF9800',
//         background: '#FFF7E6',
//         text: '#202638',
//         helper: '#FF9800',
//     },
//     error: {
//         border: '#FF3838',
//         background: '#FFF0F0',
//         text: '#202638',
//         helper: '#FF3838',
//     },
//     disabled: {
//         border: '#E5E7EB',
//         background: '#F8F9FA',
//         text: '#AEB4BF',
//         helper: '#AEB4BF',
//     },
// };

// const CommonInputComponent = ({
//     label,
//     value,
//     onChangeText,

//     type = 'text',
//     status = 'default',

//     placeholder = 'Enter here',
//     helperText = '',

//     leftIcon = null,
//     rightIcon = null,

//     height = 44,
//     fontSize = 14,
//     borderRadius = 10,

//     maxLength,
//     editable = true,
//     onPress,

//     secureTextEntry = false,
//     multiline = false,

//     required = false,
//     keyboardType,
//     options = [],
//     onSelect,
//     isOpen = false,
//     onToggleDropdown,
//     optionLabelKey = 'label',
// optionValueKey = 'value',
// }) => {
//     const [isFocused, setIsFocused] = useState(false);

//     const isDropdown = type === 'dropdown';
//     const isDisabled = status === 'disabled' || !editable;

//     const colors = statusColors[status] || statusColors.default;

//     const activeBorder = isFocused && !isDisabled
//         ? '#5366FF'
//         : colors.border;

//     const activeBackground = isFocused && !isDisabled
//         ? '#F0F0FF'
//         : colors.background;




//     const getKeyboardType = () => {
//         if (keyboardType) return keyboardType;

//         switch (type) {
//             case 'mobile':
//             case 'number':
//                 return 'number-pad';

//             case 'email':
//                 return 'email-address';

//             case 'decimal':
//                 return 'decimal-pad';

//             default:
//                 return 'default';
//         }
//     };

//     return (
//         <View style={styles.wrapper}>

//             {/* Label */}
//             {label ? (
//                 <Text style={styles.label}>
//                     {label}
//                     {required && <Text style={{ color: '#FF3838' }}> *</Text>}
//                 </Text>
//             ) : null}


//             {/* Input Box */}
//             <TouchableOpacity
//                 activeOpacity={0.8}
//                 disabled={isDisabled}
//                 onPress={() => {
//                     if (isDropdown) {
//                         onToggleDropdown?.();
//                     }
//                 }}
//                 style={[
//                     styles.inputContainer,
//                     {
//                         height,
//                         borderRadius,
//                         borderColor: isFocused ? '#5366FF' : colors.border,
//                         backgroundColor: isFocused ? '#F0F0FF' : colors.background,
//                     },
//                 ]}
//             >
//                 {leftIcon && (
//                     <View style={styles.leftIcon}>
//                         {leftIcon}
//                     </View>
//                 )}

//                 {isDropdown ? (
//                     <Text style={{
//                         flex: 1,
//                         fontSize,
//                         color: value ? colors.text : '#A0A6B3',
//                         fontFamily: 'Gilroy-Medium',
//                     }}>
//                         {value || placeholder}
//                     </Text>
//                 ) : (
//                     <TextInput
//                         value={value}
//                         onChangeText={onChangeText}
//                         placeholder={placeholder}
//                         placeholderTextColor="#A0A6B3"
//                         keyboardType={getKeyboardType()}
//                         maxLength={maxLength}
//                         editable={!isDisabled}
//                         secureTextEntry={type === 'password' || secureTextEntry}
//                         multiline={multiline}
//                         onFocus={() => setIsFocused(true)}
//                         onBlur={() => setIsFocused(false)}
//                         style={{
//                             flex: 1,
//                             height: '100%',
//                             paddingVertical: 0,
//                             fontSize,
//                             color: colors.text,
//                             fontFamily: 'Gilroy-Medium',
//                         }}
//                     />
//                 )}

//                 {rightIcon || (
//                     isDropdown && (
//                         <Text style={{ fontSize: 17, color: '#9CA3AF' }}>
//                             {isOpen ? '⌃' : '⌄'}
//                         </Text>
//                     )
//                 )}
//             </TouchableOpacity>

//             {/* Dropdown List */}
//         {isDropdown && isOpen && (
//     <View style={styles.dropdown}>
//         <ScrollView
//             nestedScrollEnabled
//             keyboardShouldPersistTaps="handled"
//             showsVerticalScrollIndicator={false}
//             style={{ maxHeight: 140 }}
//         >
//             {options.map((item) => (
//                 <TouchableOpacity
//                     key={item[optionValueKey]}
//                     style={styles.dropdownOption}
//                     onPress={() => {
//                         onSelect?.(item);
//                         onToggleDropdown?.();
//                     }}
//                 >
//                     <Text style={styles.optionText}>
//                         {item[optionLabelKey]}
//                     </Text>

//                     {value === item[optionValueKey] && (
//                         <Text style={{ color: '#5366FF' }}>✓</Text>
//                     )}
//                 </TouchableOpacity>
//             ))}
//         </ScrollView>
//     </View>
// )}

//             {/* Helper Text */}
//             {helperText ? (
//                 <Text
//                     style={{
//                         fontSize: 11,
//                         marginTop: 5,
//                         fontFamily: 'Gilroy-Medium',
//                         color: colors.helper,
//                     }}
//                 >
//                     {helperText}
//                 </Text>
//             ) : null}

//         </View>
//     );
// };

// const styles = StyleSheet.create({
//     wrapper: {
//         width: '100%',
//         marginBottom: 15,
//     },
//     label: {
//         fontSize: 13,
//         color: '#202638',
//         fontFamily: 'Gilroy-Medium',
//         marginBottom: 7,
//     },
//     inputContainer: {
//         borderWidth: 1,
//         flexDirection: 'row',
//         alignItems: 'center',
//         paddingHorizontal: 10,
//     },
//     leftIcon: {
//         marginRight: 9,
//         justifyContent: 'center',
//         alignItems: 'center',
//     },
//     rightIcon: {
//         marginLeft: 8,
//         justifyContent: 'center',
//         alignItems: 'center',
//     },
//     dropdown: {
//         marginTop: 5,
//         borderWidth: 1,
//         borderColor: '#E1E4EA',
//         borderRadius: 10,
//         backgroundColor: '#FFFFFF',
//         overflow: 'hidden',
//     },

//     dropdownOption: {
//         minHeight: 42,
//         paddingHorizontal: 12,
//         flexDirection: 'row',
//         alignItems: 'center',
//         justifyContent: 'space-between',
//         borderBottomWidth: 0.5,
//         borderBottomColor: '#EEEEEE',
//     },

//     optionText: {
//         fontSize: 13,
//         color: '#202638',
//         fontFamily: 'Gilroy-Medium',
//     },
// });

// export default CommonInputComponent;


import React, { useEffect, useState } from 'react';

import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    ScrollView,
    StyleSheet,
    Image,
    Pressable,
} from 'react-native';
import DirectionDown from "../../assets/Images/direction-down.png"

const CommonInputComponent = ({
    // Basic props
    label = '',
    value = '',
    onChangeText,
    placeholder = 'Enter here',

    // Input type
    type = 'text',

    // Size: large / medium
    size = 'large',

    // Styling
    height,
    fontSize,
    borderRadius = 10,
    backgroundColor,

    // Validation
    required = false,
    error = false,
    errorMessage = '',

    // Status: success / info / warning / error
    status = 'default',

    // Input configurations
    keyboardType,
    maxLength,
    editable = true,
    multiline = false,
    secureTextEntry = false,
    autoCapitalize = 'none',

    // Focus callbacks
    onFocus,
    onBlur,

    // Dropdown configurations
    options = [],
    optionLabelKey = 'label',
    optionValueKey = 'value',
    onSelect,
    isOpen = false,
    onToggleDropdown,

    // Additional props
    helperText = '',

    // Optional icon components/elements
    leftIcon = null,
    rightIcon = null,
    isActive,
    closeActiveDropdown,
    textAlignVertical

}) => {

    const [showPassword, setShowPassword] = useState(false);
    const [isFocused, setIsFocused] = useState(false);

    useEffect(() => {
        if (!isActive) {
            setIsFocused(false);
        }
    }, [isActive]);

    useEffect(() => {
        if (error || status === 'error') {
            setIsFocused(false);
            console.log("hahah")
        }
    }, [error, status]);

    console.log("erors", error, status)

    const isDropdown = type === 'dropdown';

    const isPassword =
        type === 'password' || secureTextEntry;

    const isDisabled = !editable;

    const hasValue =
        value !== null &&
        value !== undefined &&
        String(value).length > 0;

    // Size configuration
    const inputHeight = height ?? (
        size === 'medium' ? 40 : 50
    );

    const inputFontSize = fontSize ?? (
        size === 'medium' ? 12 : 14
    );

    // Selected dropdown item
    const selectedItem = isDropdown
        ? options.find(item =>
            value !== null &&
            value !== undefined &&
            value !== '' &&
            String(item?.[optionValueKey]) === String(value)
        )
        : null;

    const displayValue = selectedItem
        ? String(selectedItem?.[optionLabelKey] ?? '')
        : '';

    // Keyboard type
    const getKeyboardType = () => {

        if (keyboardType) return keyboardType;

        switch (type) {

            case 'mobile':
            case 'number':
                return 'number-pad';

            case 'email':
                return 'email-address';

            case 'decimal':
                return 'decimal-pad';

            default:
                return 'default';
        }
    };

    // Status colors
    const statusColors = {
        default: {
            border: '#E1E4EA',
            background: backgroundColor ?? '#FFFFFF',
            text: '#222222',
            helper: '#999FAA',
        },

        hover: {
            border: '#A5AAB8',
            background: '#F5F5F7',
            text: '#222222',
            helper: '#999FAA',
        },

        focus: {
            border: '#5366FF',
            background: '#F0F0FF',
            text: '#222222',
            helper: '#5366FF',
        },

        disabled: {
            border: '#E1E4EA',
            background: '#F5F5F5',
            text: '#A5AAB8',
            helper: '#A5AAB8',
        },

        success: {
            border: '#22C55E',
            background: '#ECFDF3',
            text: '#222222',
            helper: '#22C55E',
        },

        info: {
            border: '#0099FF',
            background: '#E8F4FF',
            text: '#222222',
            helper: '#0099FF',
        },

        warning: {
            border: '#FF9800',
            background: '#FFF7E6',
            text: '#222222',
            helper: '#FF9800',
        },

        error: {
            border: '#FF3838',
            background: '#FFF0F0',
            text: '#222222',
            helper: '#FF3838',
        },
    };

    // Determine current state
    console.log("brintha", error)
    console.log("isFocused", isFocused)
    // const getCurrentState = () => {

    //     if (isDisabled) return 'disabled';

    //     if (error || status === 'error') return 'error';

    //     if (status === 'success') return 'success';

    //     if (status === 'warning') return 'warning';

    //     if (status === 'info') return 'info';

    //     if (isFocused || (isDropdown && isOpen)) {
    //         return 'focus';
    //     }

    //     if (hasValue) return 'default';

    //     return 'default';
    // };

    const getCurrentState = () => {

        if (isDisabled) return 'disabled';

        // Focus should override error
        // if (isFocused || (isDropdown && isOpen)) {
        //     return 'focus';
        // }


        if (isActive && (isFocused || (isDropdown && isOpen))) {
            return 'focus';
        }

        if (error || status === 'error') return 'error';

        if (status === 'success') return 'success';
        if (status === 'warning') return 'warning';
        if (status === 'info') return 'info';

        if (hasValue) return 'default';

        return 'default';
    };

    const currentState = getCurrentState();

    const currentColors = statusColors[currentState];

    console.log("currentCol", currentColors)
    console.log(currentState)


    // Handle focus
    const handleFocus = () => {
        console.log("INPUT FOCUSED");
        setIsFocused(true);
        onFocus?.();

    };

    const handleBlur = () => {
        setIsFocused(false);
        onBlur?.();
    };

    // Dropdown selection
    // const handleDropdownSelect = item => {
    //     onSelect?.(item);
    // };
    const handleDropdownSelect = (item) => {
        console.log("selectedItem", item)
        setIsFocused(false);
        onBlur?.();
        onSelect?.(item);
    };

    // Helper message
    const getHelperText = () => {

        if (error && errorMessage) {
            return errorMessage;
        }

        return helperText;
    };

    console.log("all option",options)

    return (

        <View style={styles.container}>

            {/* Label */}
            {label ? (

                <View style={styles.labelContainer}>

                    <Text style={styles.label}>
                        {label}

                        {required && (
                            <Text style={styles.required}> *</Text>
                        )}
                    </Text>

                </View>

            ) : null}


            {/* Input Container */}
            <View
                style={[
                    styles.inputContainer,
                    {
                        height: multiline ? undefined : inputHeight,
                        minHeight: multiline ? inputHeight : undefined,
                        borderRadius,
                        borderColor: currentColors?.border,
                        backgroundColor: currentColors?.background,
                        borderWidth: currentState === 'focus' ? 1.5 : 1,
                    },
                ]}
            >

                {/* Left Icon */}
                {leftIcon ? (
                    <View style={styles.leftIcon}>
                        {leftIcon}
                    </View>
                ) : null}


                {/* Dropdown */}
                {isDropdown ? (

                    <TouchableOpacity
                        activeOpacity={0.8}
                        disabled={isDisabled}
                        style={styles.dropdownInput}
                        // onPress={onToggleDropdown}
                        // onPress={() => {
                        //     setIsFocused(!isOpen);
                        //     onToggleDropdown?.();
                        // }}
                        onPress={() => {
                            const nextOpen = !isOpen;
                            setIsFocused(nextOpen);
                            if(!isOpen){
                                setIsFocused(false)
                            }
                            onToggleDropdown?.();
                        }}                    
                        
                    >

                        <Text
                            numberOfLines={1}
                            style={[
                                styles.inputText,
                                {
                                    fontSize: inputFontSize,
                                    color: currentColors.text,
                                    opacity: isDisabled ? 0.6 : 1,
                                },
                            ]}
                        >
                            {displayValue || placeholder}
                        </Text>

                        {rightIcon || (
                            <Image source={DirectionDown}
                                style={{
                                    width: 22, height: 22, marginRight: 10,
                                    transform: [{ rotate: isOpen ? '180deg' : '0deg' }],
                                }} tintColor="#000"
                            />

                        )}

                    </TouchableOpacity>

                ) : (

                    /* Normal Text Input */
                    <>

                        <TextInput
                            value={
                                value === null || value === undefined
                                    ? ''
                                    : String(value)
                            }
                            onChangeText={onChangeText}
                            placeholder={placeholder}
                            placeholderTextColor="#999FAA"
                            keyboardType={getKeyboardType()}
                            maxLength={maxLength}
                            editable={editable}
                            multiline={multiline}
                            autoCapitalize={autoCapitalize}
                            // onBlur={handleBlur}
                            onFocus={() => handleFocus()}
                            onBlur={() => handleBlur()}
                            secureTextEntry={
                                isPassword && !showPassword
                            }
                            style={[
                                styles.textInput,
                                {
                                    fontSize: inputFontSize,
                                    minHeight: multiline ? inputHeight : undefined,
                                    textAlignVertical: multiline
                                        ? 'top'
                                        : 'center',
                                    color: currentColors.text,
                                    paddingVertical: multiline ? 10 : 0
                                },
                            ]}
                        />

                        {/* Password Show / Hide */}
                        {isPassword && (

                            <TouchableOpacity
                                onPress={() =>
                                    setShowPassword(prev => !prev)
                                }
                                style={styles.passwordButton}
                            >
                                <Text style={styles.passwordText}>
                                    {showPassword ? 'Hide' : 'Show'}
                                </Text>
                            </TouchableOpacity>

                        )}

                        {/* Right Icon */}
                        {!isPassword && rightIcon ? (
                            <View style={styles.rightIcon}>
                                {rightIcon}
                            </View>
                        ) : null}

                    </>

                )}

            </View>


            {/* Dropdown Options */}
            {/* {isDropdown && isOpen && (
                <>
                   
                    <Pressable
                        style={styles.dropdownOverlay}
                        onPress={() => closeActiveDropdown()}
                    />

                  
                    <View style={styles.dropdownList}>

                        <ScrollView
                            nestedScrollEnabled
                            keyboardShouldPersistTaps="handled"
                            showsVerticalScrollIndicator
                        >
                            {options.length > 0 ? (

                                options.map((item, index) => {

                                    const itemValue = item?.[optionValueKey];
                                    const itemLabel = item?.[optionLabelKey];

                                    const isSelected =
                                        value !== null &&
                                        value !== undefined &&
                                        value !== '' &&
                                        String(itemValue) === String(value);

                                    return (
                                        <TouchableOpacity
                                            key={String(itemValue ?? index)}
                                            activeOpacity={0.7}
                                            style={styles.dropdownOption}
                                            onPress={() => handleDropdownSelect(item)}
                                        >
                                            <Text
                                                style={[
                                                    styles.optionText,
                                                    isSelected && styles.selectedOption,
                                                ]}
                                            >
                                                {itemLabel}
                                            </Text>

                                            {isSelected && (
                                                <Text style={styles.tick}>✓</Text>
                                            )}
                                        </TouchableOpacity>
                                    );
                                })

                            ) : (
                                <Text style={styles.emptyText}>
                                    No options available
                                </Text>
                            )}
                        </ScrollView>
                    </View>
                </>
            )} */}

            {isDropdown && isOpen && (
                <>
                    <Pressable
                        style={styles.dropdownOverlay}
                        onPress={() => closeActiveDropdown()}
                    />

                    <View style={styles.dropdownList}>

                        <ScrollView
                            nestedScrollEnabled
                            keyboardShouldPersistTaps="handled"
                            showsVerticalScrollIndicator
                        >

                            {options.length > 0 ? (

                                options.map((item, index) => {

                                    const itemValue = item?.[optionValueKey];
                                    const itemLabel = item?.[optionLabelKey];

                                    const isSelected =
                                        value !== null &&
                                        value !== undefined &&
                                        value !== '' &&
                                        String(itemValue) === String(value);

                                    return (

                                        <TouchableOpacity
                                            key={String(itemValue ?? index)}
                                            activeOpacity={0.7}
                                            style={styles.dropdownOption}
                                            onPress={() =>
                                                handleDropdownSelect(item)
                                            }
                                        >

                                            <Text
                                                style={[
                                                    styles.optionText,
                                                    isSelected && styles.selectedOption,
                                                ]}
                                            >
                                                {itemLabel}
                                            </Text>

                                            {isSelected && (
                                                <Text style={styles.tick}>✓</Text>
                                            )}

                                        </TouchableOpacity>

                                    );

                                })

                            ) : (

                                <Text style={styles.emptyText}>
                                    No options available
                                </Text>

                            )}

                        </ScrollView>

                    </View>
                </>
            )}



            {/* Helper / Error Text */}
            {getHelperText() ? (

                <Text
                    style={[
                        styles.helperText,
                        {
                            color: currentColors.helper,
                        },
                    ]}
                >
                    {getHelperText()}
                </Text>

            ) : null}

        </View>

    );
};


const styles = StyleSheet.create({

    container: {
        width: '100%',
        marginBottom: 9,
    },

    labelContainer: {
        marginBottom: 7,
        marginTop: 12
    },

    label: {
        fontSize: 14,
        color: '#222222',
        fontFamily: 'Gilroy-Medium',
    },

    required: {
        color: '#FF3838',
    },

    inputContainer: {
        width: '100%',
        borderWidth: 1,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 12,
        overflow: 'hidden',
        marginTop: 5
    },

    textInput: {
        flex: 1,
        paddingVertical: 0,
        fontFamily: 'Gilroy-Medium',
    },

    dropdownInput: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },

    inputText: {
        flex: 1,
        fontFamily: 'Gilroy-Medium',
    },

    dropdownArrow: {
        fontSize: 11,
        marginLeft: 10,
    },

    leftIcon: {
        marginRight: 10,
        alignItems: 'center',
        justifyContent: 'center',
    },

    rightIcon: {
        marginLeft: 10,
        alignItems: 'center',
        justifyContent: 'center',
    },

    passwordButton: {
        paddingLeft: 10,
    },

    passwordText: {
        fontSize: 12,
        color: '#246BFD',
        fontFamily: 'Gilroy-SemiBold',
    },

    // dropdownList: {
    //     marginTop: 5,
    //     maxHeight: 180,
    //     backgroundColor: '#FFFFFF',
    //     borderWidth: 1,
    //     borderColor: '#D9DDE5',
    //     borderRadius: 8,
    //     overflow: 'hidden',
    // },

    dropdownOption: {
        minHeight: 45,
        paddingHorizontal: 12,
        paddingVertical: 10,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottomWidth: 0.5,
        borderBottomColor: '#EEEEEE',
    },

    optionText: {
        fontSize: 14,
        color: '#333333',
        fontFamily: 'Gilroy-Medium',
    },

    selectedOption: {
        color: '#246BFD',
        fontFamily: 'Gilroy-SemiBold',
    },

    tick: {
        fontSize: 16,
        color: '#246BFD',
    },

    emptyText: {
        padding: 15,
        color: '#999999',
        textAlign: 'center',
        fontSize: 13,
    },

    helperText: {
        fontSize: 11,
        marginTop: 5,
        fontFamily: 'Gilroy-Medium',
    },
    dropdownOverlay: {
        position: 'absolute',
        top: -1000,
        left: -1000,
        right: -1000,
        bottom: -1000,
        zIndex: 10,
    },

    dropdownList: {
        position: 'absolute',
        top: 100,
        left: 0,
        right: 0,
        backgroundColor: '#FFFFFF',
        borderRadius: 10,
        elevation: 8,
        zIndex: 11,
        maxHeight: 200,
        borderWidth: 1,
        borderColor: '#D9DDE5',
    },

});

export default CommonInputComponent;

